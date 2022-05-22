import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppStoreInterface } from '@app/store/app-store.interface';

export const settingsLocalStorageSyncReducer = (r: ActionReducer<AppStoreInterface>) => localStorageSync({
    keys: [
        'settings',
    ],
    rehydrate: true,
})(r);
