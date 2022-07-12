import { Injectable } from '@angular/core';

import { PlatformApi } from '@app/shared/types/platform/platform-api';
import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';

@Injectable()
export class PlatformApiNativeAppService implements PlatformApi {
    constructor(
        private electronIpc: ElectronIpcProxyService,
    ) {}

    openInBrowser(url: string | URL, target?: string) {
        const openUrl = url instanceof URL ? url.toString() : url;

        this.electronIpc.openInBrowser(openUrl);
    }
}
