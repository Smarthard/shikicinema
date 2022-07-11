import { Injectable } from '@angular/core';

import { PlatformApi } from '@app/shared/types/platform/platform-api';

@Injectable()
export class PlatformApiWebExtensionService implements PlatformApi {
    openInBrowser(url: string | URL, target?: string) {
        window.open(url, target);
    }
}
