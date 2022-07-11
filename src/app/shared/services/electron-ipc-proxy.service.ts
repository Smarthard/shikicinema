import { Injectable } from '@angular/core';

import { environment } from '@app-env/environment';
import { IpcApiInterface } from '@app-electron/types/ipc-api.interface';

@Injectable()
export class ElectronIpcProxyService implements IpcApiInterface {
    #electronApi: IpcApiInterface;

    constructor() {
        this.#electronApi = (window as any).electron;
    }

    getShikimoriAuthCode(): Promise<string> {
        const codeUrl = new URL('https://shikimori.one/oauth/authorize?');
        codeUrl.searchParams.set('client_id', environment.shikimori.authClientId);
        codeUrl.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');
        codeUrl.searchParams.set('response_type', 'code');

        return this.#electronApi.getShikimoriAuthCode(codeUrl.toString());
    }

    openInBrowser(url: string): void {
        this.#electronApi.openInBrowser(url);
    }
}
