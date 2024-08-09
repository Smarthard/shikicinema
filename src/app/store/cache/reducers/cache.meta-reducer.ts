import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppStoreInterface } from '@app/store/app-store.interface';

export const cacheLocalStorageSyncReducer = (r: ActionReducer<AppStoreInterface>) => localStorageSync({
    keys: [
        'cache',
    ],
    rehydrate: true,
})(r);
