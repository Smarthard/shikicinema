import { InjectionToken } from '@angular/core';

import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';
import { PlatformApi } from '@app/shared/types/platform/platform-api';
import { PlatformApiNativeAppService } from '@app/shared/services/platform-api/platform-api.native-app.service';
import { PlatformApiWebExtensionService } from '@app/shared/services/platform-api/platform-api.web-extension.service';
import { environment } from '@app-env/environment';

export const PLATFORM_API_TOKEN = new InjectionToken<PlatformApi>('SHIKICINEMA_PLATFORM_API');

export const platformApiFactory = (electronIpc: ElectronIpcProxyService): PlatformApi => {
    const targetPlatform = environment.target;

    switch (targetPlatform) {
        case 'web-extension':
            return new PlatformApiWebExtensionService();
        case 'native-app':
            return new PlatformApiNativeAppService(electronIpc);
    }
};
