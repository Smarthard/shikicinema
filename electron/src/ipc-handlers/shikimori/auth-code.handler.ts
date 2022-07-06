import { BrowserWindow } from 'electron';

function getCodeFromAuthUrl(url: string) {
    const tabUrl = new URL(url);
    const code = url.split('authorize/')[1];
    const error = tabUrl.searchParams.get('error');
    const message = tabUrl.searchParams.get('error_description');

    if (error) {
        throw new Error(message);
    }

    return code;
}

export default async function shikimoriAuthCodeHandler(
    authUrl: string,
    parentWindow: BrowserWindow = undefined,
    isDev = false,
) {
    return new Promise(async (resolve, reject) => {
        let authWindow = new BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            parent: parentWindow,
            modal: !!parentWindow,
            autoHideMenuBar: true,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                devTools: isDev,
            },
        });

        authWindow.webContents.on(
            'will-navigate',
            (event, url) => {
                try {
                    const code = getCodeFromAuthUrl(url);

                    resolve(code);
                } catch (e) {
                    reject(e);
                } finally {
                    authWindow.close();
                }
            },
        );

        authWindow.webContents.on(
            'did-navigate',
            (event, url) => {
                try {
                    const code = getCodeFromAuthUrl(url);

                    resolve(code);
                } catch (e) {
                    reject(e);
                } finally {
                    authWindow.close();
                }
            },
        );

        authWindow.on('close', () => {
            authWindow = null;
            reject(null);
        });

        await authWindow.loadURL(authUrl);
        authWindow.show();
    });
}
