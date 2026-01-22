import { createFeatureSelector, createSelector } from '@ngrx/store';

import RecentAnimesStoreInterface from '@app/modules/home/store/recent-animes/types/recent-animes-store.interface';
import { recentAnimesToRates } from '@app/modules/home/store/recent-animes/utils/recent-animes-to-rates.function';
import { selectCachedAnimes } from '@app/store/cache';

export const selectAnimeRates = createFeatureSelector<RecentAnimesStoreInterface>('recentAnimes');

export const selectRecentAnimes = createSelector(
    selectAnimeRates,
    selectCachedAnimes,
    (animeRates, cachedAnimes) => recentAnimesToRates(animeRates.recentAnimes, cachedAnimes),
);
