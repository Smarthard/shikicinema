import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppStoreInterface } from '@app/store/app-store.interface';

export const shikicinemaLocalStorageSyncReducer = (r: ActionReducer<AppStoreInterface>) => localStorageSync({
    keys: [
        'shikicinema',
    ],
    rehydrate: true,
})(r);
