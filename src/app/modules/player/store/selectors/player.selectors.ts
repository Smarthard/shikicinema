import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { PlayerStoreInterface } from '@app/modules/player/store/types';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export const selectPlayer = createFeatureSelector<PlayerStoreInterface>('player');

export const selectPlayerVideos = (animeId: string) => createSelector(
    selectPlayer,
    ({ videos }) => videos[animeId] || [],
);

export const selectPlayerVideosLoading = (animeId: string) => createSelector(
    selectPlayer,
    ({ videos }) => !videos[animeId],
);

export const selectPlayerAnime = (animeId: string | number) => createSelector(
    selectPlayer,
    ({ animeInfo }) => animeInfo[`${animeId}`] || {} as AnimeBriefInfoInterface,
);

export const selectPlayerAnimeLoading = (animeId: string | number) => createSelector(
    selectPlayer,
    ({ animeInfo }) => !animeInfo[`${animeId}`],
);

export const selectPlayerUserRate = (animeId: string | number) => createSelector(
    selectPlayerAnime(animeId),
    // eslint-disable-next-line camelcase
    ({ user_rate }) => user_rate,
);

export const selectPlayerTopic = (animeId: string | number, episode: string | number) => createSelector(
    selectPlayer,
    ({ comments }) => comments?.[animeId]?.[episode]?.topic,
);

export const selectPlayerIsCommentsLoading = (animeId: string | number, episode: string | number) => createSelector(
    selectPlayer,
    ({ comments }) => comments?.[animeId]?.[episode]?.isLoading,
);

export const selectPlayerIsCommentsPartiallyLoading = (animeId: ResourceIdType, episode: ResourceIdType) =>
    createSelector(
        selectPlayer,
        ({ comments }) => comments?.[animeId]?.[episode]?.comments?.length < 20,
    );

export const selectPlayerIsShownAllComments = (animeId: string | number, episode: string | number) => createSelector(
    selectPlayer,
    ({ comments }) => comments?.[animeId]?.[episode]?.isShownAll,
);

export const selectPlayerComments = (animeId: string | number, episode: string | number) => createSelector(
    selectPlayer,
    ({ comments }) => comments?.[animeId]?.[episode]?.comments || [],
);
