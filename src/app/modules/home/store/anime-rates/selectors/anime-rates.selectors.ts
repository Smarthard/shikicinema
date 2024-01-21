import { createFeatureSelector, createSelector } from '@ngrx/store';

import AnimeRatesStoreInterface from '@app/modules/home/store/anime-rates/types/anime-rates-store.interface';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';
import {
    getRateLoadedKey,
    getRatePageKey,
    getRateStoreKey,
} from '@app/modules/home/store/anime-rates/helpers/anime-rates-store-key.helpers';

export const selectAnimeRates = createFeatureSelector<AnimeRatesStoreInterface>('animeRates');

export const selectRatesByStatus = (status: UserRateStatusType) => createSelector(
    selectAnimeRates,
    (state) => {
        const key = getRateStoreKey(status);

        return state?.[key] || [];
    },
);

export const selectRatesPageByStatus = (status: UserRateStatusType) => createSelector(
    selectAnimeRates,
    (state) => {
        const key = getRatePageKey(status);

        return state?.[key];
    },
);

export const selectIsRatesLoadedByStatus = (status: UserRateStatusType) => createSelector(
    selectAnimeRates,
    (state) => {
        const key = getRateLoadedKey(status);

        return state?.[key];
    },
);
