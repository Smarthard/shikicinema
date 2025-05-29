import { createFeatureSelector, createSelector } from '@ngrx/store';

import RecentAnimesStoreInterface from '@app/modules/home/store/recent-animes/types/recent-animes-store.interface';

export const selectAnimeRates = createFeatureSelector<RecentAnimesStoreInterface>('recentAnimes');

export const selectRecentAnimes = createSelector(
    selectAnimeRates,
    (state) => state.recentAnimes,
);

