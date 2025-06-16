import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { IpcApiInterface } from '@app-electron/types/ipc-api.interface';
import { environment } from '@app-env/environment';
import { selectShikimoriDomain } from '@app/store/shikimori/selectors';

@Injectable()
export class ElectronIpcProxyService implements IpcApiInterface {
    #electronApi: IpcApiInterface;

    private readonly store = inject(Store);
    private readonly shikimoriDomain$ = this.store.select(selectShikimoriDomain);

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.#electronApi = (window as any).electron;
    }

    async getShikimoriAuthCode(): Promise<string> {
        const shikimoriDomain = await firstValueFrom(this.shikimoriDomain$);
        const codeUrl = new URL(`${shikimoriDomain}/oauth/authorize?`);
        codeUrl.searchParams.set('client_id', environment.shikimori.authClientId);
        codeUrl.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');
        codeUrl.searchParams.set('response_type', 'code');

        return this.#electronApi.getShikimoriAuthCode(codeUrl.toString());
    }

    openInBrowser(url: string, target: string): void {
        this.#electronApi.openInBrowser(url, target);
    }
}
