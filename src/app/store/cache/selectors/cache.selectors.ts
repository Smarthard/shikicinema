import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CacheStoreInterface } from '@app/store/cache/types';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export const selectCache = createFeatureSelector<CacheStoreInterface>('cache');

export const selectKnownUploaders = createSelector(
    selectCache,
    ({ knownUploaders }) => knownUploaders,
);

export const selectCachedAnimes = createSelector(
    selectCache,
    ({ animes }) => animes,
);

export const selectCachedAnimeById = (animeId: ResourceIdType) => createSelector(
    selectCache,
    ({ animes }) => animes?.[animeId]?.anime,
);

export const selectCacheLastCheckUp = createSelector(
    selectCache,
    ({ lastCheckUp }) => new Date(lastCheckUp),
);
