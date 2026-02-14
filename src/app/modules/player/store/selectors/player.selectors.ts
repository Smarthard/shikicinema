import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { PlayerStoreInterface } from '@app/modules/player/store/types';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export const selectPlayer = createFeatureSelector<PlayerStoreInterface>('player');

export const selectPlayerVideos = (animeId: ResourceIdType) => createSelector(
    selectPlayer,
    ({ videos }) => videos[animeId] || [],
);

export const selectPlayerVideosLoading = (animeId: ResourceIdType) => createSelector(
    selectPlayer,
    ({ videos }) => !videos[animeId],
);

export const selectPlayerAnime = (animeId: ResourceIdType) => createSelector(
    selectPlayer,
    ({ animeInfo }) => animeInfo[`${animeId}`] || {} as AnimeBriefInfoInterface,
);

export const selectPlayerAnimeLoading = (animeId: ResourceIdType) => createSelector(
    selectPlayer,
    ({ animeInfo }) => !animeInfo[`${animeId}`],
);

export const selectPlayerUserRate = (animeId: ResourceIdType) => createSelector(
    selectPlayerAnime(animeId),
    ({ user_rate: rate }) => rate,
);

export const selectPlayerTopic = (animeId: ResourceIdType, episode: ResourceIdType) => createSelector(
    selectPlayer,
    ({ comments }) => comments?.[animeId]?.[episode]?.topic,
);

export const selectPlayerIsCommentsLoading = (animeId: ResourceIdType, episode: ResourceIdType) => createSelector(
    selectPlayer,
    ({ comments }) => comments?.[animeId]?.[episode]?.isLoading,
);

export const selectPlayerIsCommentsPartiallyLoading = (animeId: ResourceIdType, episode: ResourceIdType) =>
    createSelector(
        selectPlayer,
        ({ comments }) => comments?.[animeId]?.[episode]?.comments?.length < 20 &&
            comments?.[animeId]?.[episode]?.comments?.length < comments?.[animeId]?.[episode]?.topic?.comments_count,
    );

export const selectPlayerIsShownAllComments = (animeId: ResourceIdType, episode: ResourceIdType) => createSelector(
    selectPlayer,
    ({ comments }) => comments?.[animeId]?.[episode]?.isShownAll,
);

export const selectPlayerComments = (animeId: ResourceIdType, episode: ResourceIdType) => createSelector(
    selectPlayer,
    ({ comments }) => comments?.[animeId]?.[episode]?.comments || [],
);
