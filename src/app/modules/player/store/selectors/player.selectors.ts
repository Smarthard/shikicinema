import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
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

export const selectPlayerAnime = (animeId: string) => createSelector(
    selectPlayer,
    ({ animeInfo }) => animeInfo[animeId] || {} as AnimeBriefInfoInterface,
);

export const selectPlayerAnimeLoading = (animeId: string) => createSelector(
    selectPlayer,
    ({ animeInfo }) => !animeInfo[animeId],
);
