import chokidar from 'chokidar';
import electronIsDev from 'electron-is-dev';
import electronServe from 'electron-serve';
import windowStateKeeper, { State } from 'electron-window-state';
import {
    BrowserWindow,
    Menu,
    MenuItem,
    MenuItemConstructorOptions,
    Tray,
    app,
    nativeImage,
    session,
} from 'electron';
import {
    CapElectronEventEmitter,
    CapacitorElectronConfig,
    CapacitorSplashScreen,
    setupCapacitorElectronPlugins,
} from '@capacitor-community/electron';
import { join } from 'path';

// Define components for a watcher to detect when the webapp is changed so we can reload in Dev mode.
const reloadWatcher = {
    debouncer: null,
    ready: false,
    watcher: null,
};

export function setupReloadWatcher(electronCapacitorApp: ElectronCapacitorApp): void {
    reloadWatcher.watcher = chokidar
        .watch(join(app.getAppPath(), 'app'), {
            ignored: /[/\\]\./,
            persistent: true,
        })
        .on('ready', () => {
            reloadWatcher.ready = true;
        })
        .on('all', (_event, _path) => {
            if (reloadWatcher.ready) {
                clearTimeout(reloadWatcher.debouncer);
                reloadWatcher.debouncer = setTimeout(async () => {
                    electronCapacitorApp.getMainWindow().webContents.reload();
                    reloadWatcher.ready = false;
                    clearTimeout(reloadWatcher.debouncer);
                    reloadWatcher.debouncer = null;
                    reloadWatcher.watcher = null;
                    setupReloadWatcher(electronCapacitorApp);
                }, 1500);
            }
        });
}

// Define our class to manage our app.
export class ElectronCapacitorApp {
    private readonly trayMenuTemplate: (MenuItem | MenuItemConstructorOptions)[] = [
        new MenuItem({ label: 'Quit App', role: 'quit' }),
    ];

    private readonly appMenuBarMenuTemplate: (MenuItem | MenuItemConstructorOptions)[] = [
        { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
        { role: 'viewMenu' },
    ];

    private readonly customScheme: string;

    private mainWindow: BrowserWindow | null = null;
    private splashScreen: CapacitorSplashScreen | null = null;
    private trayIcon: Tray | null = null;
    private capacitorFileConfig: CapacitorElectronConfig;
    private mainWindowState: State;
    private loadWebApp;

    constructor(
        capacitorFileConfig: CapacitorElectronConfig,
        trayMenuTemplate?: (MenuItemConstructorOptions | MenuItem)[],
        appMenuBarMenuTemplate?: (MenuItemConstructorOptions | MenuItem)[],
    ) {
        this.capacitorFileConfig = capacitorFileConfig;

        this.customScheme = this.capacitorFileConfig.electron?.customUrlScheme ?? 'capacitor-electron';

        if (trayMenuTemplate) {
            this.trayMenuTemplate = trayMenuTemplate;
        }

        if (appMenuBarMenuTemplate) {
            this.appMenuBarMenuTemplate = appMenuBarMenuTemplate;
        }

        this.loadWebApp = electronServe({
            directory: join(app.getAppPath(), 'app'),
            scheme: this.customScheme,
        });
    }

    // Helper function to load in the app.
    private static async loadMainWindow(thisRef: any): Promise<void> {
        await thisRef.loadWebApp(thisRef.mainWindow);
    }

    // Expose the mainWindow ref for use outside of the class.
    getMainWindow(): BrowserWindow {
        return this.mainWindow;
    }

    getCustomURLScheme(): string {
        return this.customScheme;
    }

    async init(): Promise<void> {
        const icon = nativeImage.createFromPath(
            join(app.getAppPath(), 'assets', process.platform === 'win32' ? 'appIcon.ico' : 'appIcon.png'),
        );
        this.mainWindowState = windowStateKeeper({
            defaultWidth: 1000,
            defaultHeight: 800,
        });
        // Setup preload script path and construct our main window.
        const preloadPath = join(app.getAppPath(), 'build', 'src', 'preload.js');
        this.mainWindow = new BrowserWindow({
            icon,
            show: false,
            x: this.mainWindowState.x,
            y: this.mainWindowState.y,
            width: this.mainWindowState.width,
            height: this.mainWindowState.height,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                preload: preloadPath,
            },
        });
        this.mainWindowState.manage(this.mainWindow);

        if (this.capacitorFileConfig.backgroundColor) {
            this.mainWindow.setBackgroundColor(this.capacitorFileConfig.electron.backgroundColor);
        }

        // If we close the main window with the splashscreen enabled we need to destory the ref.
        this.mainWindow.on('closed', () => {
            if (this.splashScreen?.getSplashWindow() && !this.splashScreen.getSplashWindow().isDestroyed()) {
                this.splashScreen.getSplashWindow().close();
            }
        });

        // When the tray icon is enabled, setup the options.
        if (this.capacitorFileConfig.electron?.trayIconAndMenuEnabled) {
            this.trayIcon = new Tray(icon);
            this.trayIcon.on('double-click', () => {
                if (this.mainWindow) {
                    if (this.mainWindow.isVisible()) {
                        this.mainWindow.hide();
                    } else {
                        this.mainWindow.show();
                        this.mainWindow.focus();
                    }
                }
            });
            this.trayIcon.on('click', () => {
                if (this.mainWindow) {
                    if (this.mainWindow.isVisible()) {
                        this.mainWindow.hide();
                    } else {
                        this.mainWindow.show();
                        this.mainWindow.focus();
                    }
                }
            });
            this.trayIcon.setToolTip(app.getName());
            this.trayIcon.setContextMenu(Menu.buildFromTemplate(this.trayMenuTemplate));
        }

        // Setup the main manu bar at the top of our window.
        Menu.setApplicationMenu(Menu.buildFromTemplate(this.appMenuBarMenuTemplate));

        // If the splashscreen is enabled, show it first while the main window loads
        // then dwitch it out for the main window, or just load the main window from the start.
        if (this.capacitorFileConfig.electron?.splashScreenEnabled) {
            this.splashScreen = new CapacitorSplashScreen({
                imageFilePath: join(
                    app.getAppPath(),
                    'assets',
                    this.capacitorFileConfig.electron?.splashScreenImageName ?? 'splash.png',
                ),
                windowWidth: 400,
                windowHeight: 400,
            });
            this.splashScreen.init(ElectronCapacitorApp.loadMainWindow, this);
        } else {
            ElectronCapacitorApp.loadMainWindow(this);
        }

        // Security
        this.mainWindow.webContents.setWindowOpenHandler((details) => {
            if (!details.url.includes(this.customScheme)) {
                return { action: 'deny' };
            } else {
                return { action: 'allow' };
            }
        });
        this.mainWindow.webContents.on('will-navigate', (event, _newURL) => {
            if (!this.mainWindow.webContents.getURL().includes(this.customScheme)) {
                event.preventDefault();
            }
        });

        // Link electron plugins into the system.
        setupCapacitorElectronPlugins();

        // When the web app is loaded we hide the splashscreen if needed and show the mainwindow.
        this.mainWindow.webContents.on('dom-ready', () => {
            if (this.capacitorFileConfig.electron?.splashScreenEnabled) {
                this.splashScreen.getSplashWindow().hide();
            }

            if (!this.capacitorFileConfig.electron?.hideMainWindowOnLaunch) {
                this.mainWindow.show();
            }

            setTimeout(() => {
                this.mainWindow.webContents.openDevTools();
                if (electronIsDev) {
                }
                CapElectronEventEmitter.emit('CAPELECTRON_DeeplinkListenerInitialized', '');
            }, 400);
        });
    }
}

// Set a CSP up for our application based on the custom scheme
export function setupContentSecurityPolicy(customScheme: string): void {
    const allowedRemotes = [
        'https://shikimori.one',
        'https://*.shikimori.one',
        'https://shikimori.org',
        'https://*.shikimori.org',
        'https://shiki.one',
        'https://*.shiki.one',
        'https://smarthard.net',
        'https://*.smarthard.net',
        'https://smarthard.net',
        'https://*.smarthard.net',
        'https://kodikapi.com',
        'https://*.recaptcha.net',
        'https://*.gstatic.com',
        'https://vk.com',
        'https://*.vk.com',
        'https://googleapis.com/',
        'https://*.googleapis.com/',
        'https://cloudflare.com',
        'https://*.cloudflare.com',
    ].join(' ');

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Security-Policy': [
                    electronIsDev
                        ? `default-src ${customScheme}://* ${allowedRemotes} 'unsafe-inline' devtools://* 'unsafe-eval' data: blob: ; frame-src * ; media-src * blob: ; img-src 'self' data: *`
                        : `default-src ${customScheme}://* ${allowedRemotes} 'unsafe-inline' data: blob: 'unsafe-eval' self ; frame-src * ; media-src * blob: ; img-src 'self' data: *`,
                ],
            },
        });
    });
}
