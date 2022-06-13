import { createFeatureSelector, createSelector } from '@ngrx/store';

import AnimeRatesStoreInterface from '@app/home/store/anime-rates/types/anime-rates-store.interface';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';
import {
    getRateLoadedKey,
    getRatePageKey,
    getRateStoreKey
} from '@app/home/store/anime-rates/helpers/anime-rates-store-key.helpers';

export const animeRatesFeatureSelector = createFeatureSelector<AnimeRatesStoreInterface>('animeRates');

export const ratesByStatusSelector = (status: UserRateStatusType) => createSelector(
    animeRatesFeatureSelector,
    (state) => {
        const key = getRateStoreKey(status);

        return state?.[key] || [];
    },
);

export const ratesPageByStatusSelector = (status: UserRateStatusType) => createSelector(
    animeRatesFeatureSelector,
    (state) => {
        const key = getRatePageKey(status);

        return state?.[key];
    },
);

export const isRatesLoadedByStatusSelector = (status: UserRateStatusType) => createSelector(
    animeRatesFeatureSelector,
    (state) => {
        const key = getRateLoadedKey(status);

        return state?.[key];
    },
);
