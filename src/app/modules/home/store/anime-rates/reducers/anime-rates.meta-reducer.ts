import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppStoreInterface } from '@app/store/app-store.interface';
import { unzip, zip } from '@app/shared/utils/zip.utils';

export const animeRatesLocalStorageSyncReducer = (r: ActionReducer<AppStoreInterface>) => localStorageSync({
    keys: [{
        animeRates: {
            encrypt: zip,
            decrypt: unzip,
            filter: ['rates', 'metadata'],
        },
    }],
    rehydrate: true,
})(r);
