import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppStoreInterface } from '@app/store/app-store.interface';

export const shikimoriLocalStorageSyncReducer = (r: ActionReducer<AppStoreInterface>) => localStorageSync({
    keys: [{
        shikimori: [
            'isCurrentUserLoading',
            'currentUser',
            'shikimoriDomain',
        ],
    }],
    rehydrate: true,
})(r);
