import type { CapacitorElectronConfig } from '@capacitor-community/electron';
import { getCapacitorElectronConfig, setupElectronDeepLinking } from '@capacitor-community/electron';
import type { MenuItemConstructorOptions } from 'electron';
import {
    app,
    ipcMain,
    MenuItem,
    shell,
} from 'electron';
import electronIsDev from 'electron-is-dev';
import unhandled from 'electron-unhandled';
import { autoUpdater } from 'electron-updater';

import { ElectronCapacitorApp, setupContentSecurityPolicy, setupReloadWatcher } from './setup';
import shikimoriAuthCodeHandler from './ipc-handlers/shikimori/auth-code.handler';

// Graceful handling of unhandled errors.
unhandled({ logger: console.log });

// Define our menu templates (these are optional)
const trayMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [new MenuItem({ label: 'Quit App', role: 'quit' })];
const appMenuBarMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
    { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
    { role: 'viewMenu' },
];

// Get Config options from capacitor.config
const capacitorFileConfig: CapacitorElectronConfig = getCapacitorElectronConfig();

// Initialize our app. You can pass menu templates into the app here.
// const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig);
const renderer = new ElectronCapacitorApp(capacitorFileConfig, trayMenuTemplate, appMenuBarMenuTemplate);

// If deeplinking is enabled then we will set it up here.
if (capacitorFileConfig.electron?.deepLinkingEnabled) {
    setupElectronDeepLinking(renderer, {
        customProtocol: capacitorFileConfig.electron.deepLinkingCustomProtocol ?? 'mycapacitorapp',
    });
}

// If we are in Dev mode, use the file watcher components.
if (electronIsDev) {
    setupReloadWatcher(renderer);
}

// Run Application
(async () => {
    // Wait for electron app to be ready.
    await app.whenReady();
    // Security - Set Content-Security-Policy based on whether or not we are in dev mode.
    setupContentSecurityPolicy(renderer.getCustomURLScheme());
    // Initialize our app, build windows, and load content.
    await renderer.init();

    // TODO: add autoupdate
    // Check for updates if we are in a packaged app.
    // autoUpdater.checkForUpdatesAndNotify();
})();

// Handle when all of our windows are close (platforms have their own expectations).
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// When the dock icon is clicked.
app.on('activate', async function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (renderer.getMainWindow().isDestroyed()) {
        await renderer.init();
    }
});

// Place all ipc or other electron api calls and custom functionality under this line
ipcMain.removeAllListeners('shikimori-auth-code');
ipcMain.handle('shikimori-auth-code', async (evt, authUrl) => await shikimoriAuthCodeHandler(authUrl, renderer.getMainWindow(), electronIsDev));

ipcMain.removeAllListeners('open-external-link');
ipcMain.on('open-external-link', (evt, url) => shell.openExternal(url));
