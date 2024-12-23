import { Injectable } from '@angular/core';

import { IpcApiInterface } from '@app-electron/types/ipc-api.interface';
import { environment } from '@app-env/environment';

@Injectable()
export class ElectronIpcProxyService implements IpcApiInterface {
    #electronApi: IpcApiInterface;

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.#electronApi = (window as any).electron;
    }

    getShikimoriAuthCode(): Promise<string> {
        const codeUrl = new URL('https://shikimori.one/oauth/authorize?');
        codeUrl.searchParams.set('client_id', environment.shikimori.authClientId);
        codeUrl.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');
        codeUrl.searchParams.set('response_type', 'code');

        return this.#electronApi.getShikimoriAuthCode(codeUrl.toString());
    }

    openInBrowser(url: string, target: string): void {
        this.#electronApi.openInBrowser(url, target);
    }
}
