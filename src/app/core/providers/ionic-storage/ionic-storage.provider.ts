import { PLATFORM_ID, Provider } from '@angular/core';
import { Storage, StorageConfigToken, provideStorage } from '@ionic/storage-angular';
import { StorageConfig } from '@ionic/storage';

export function provideIonicStorage(storageConfig?: StorageConfig): Provider[] {
    return [
        { provide: StorageConfigToken, useValue: storageConfig },
        { provide: Storage, useFactory: provideStorage, deps: [PLATFORM_ID, StorageConfigToken] },
    ];
}
