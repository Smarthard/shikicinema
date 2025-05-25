import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppStoreInterface } from '@app/store/app-store.interface';

export const recentAnimesLocalStorageSyncReducer = (r: ActionReducer<AppStoreInterface>) => localStorageSync({
    keys: [
        'recentAnimes',
    ],
    rehydrate: true,
})(r);
