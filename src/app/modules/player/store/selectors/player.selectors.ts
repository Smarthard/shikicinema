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

export const selectCurrentPlayerAnime = createSelector(
    selectPlayer,
    ({ animeInfo, currentAnimeId }) => animeInfo[`${currentAnimeId}`] || {} as AnimeBriefInfoInterface,
);

export const selectCurrentPlayerEpisode = createSelector(
    selectPlayer,
    ({ currentEpisode }) => currentEpisode || 1,
);

export const selectPlayerAnimeLoading = (animeId: ResourceIdType) => createSelector(
    selectPlayerAnime(animeId),
    (anime) => !anime,
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

export const selectPlayerIsFranchiseLoading = (animeId: ResourceIdType) => createSelector(
    selectPlayer,
    ({ franchise }) => !franchise?.[animeId],
);

export const selectPlayerFranchise = (animeId: ResourceIdType) => createSelector(
    selectPlayer,
    ({ franchise }) => franchise?.[animeId],
);
