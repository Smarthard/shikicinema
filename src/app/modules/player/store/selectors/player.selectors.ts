import { createFeatureSelector, createSelector } from '@ngrx/store';

import { PlayerStoreInterface } from '@app/modules/player/store/types';

export const selectPlayer = createFeatureSelector<PlayerStoreInterface>('player');

export const selectPlayerVideos = (animeId: string) => createSelector(
    selectPlayer,
    ({ videos }) => videos[animeId] || [],
);

export const selectPlayerVideosLoading = (animeId: string) => createSelector(
    selectPlayer,
    ({ videos }) => !videos[animeId],
);
