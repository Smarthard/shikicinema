import { Injectable } from '@angular/core';

import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';
import { PlatformApi } from '@app/shared/types/platform/platform-api';

@Injectable()
export class PlatformApiNativeAppService implements PlatformApi {
    constructor(
        private electronIpc: ElectronIpcProxyService,
    ) {}

    openInBrowser(url: string | URL, target?: string) {
        const openUrl = url instanceof URL ? url.toString() : url;

        this.electronIpc.openInBrowser(openUrl, target);
    }
}
