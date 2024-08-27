import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CacheStoreInterface } from '@app/store/cache/types';

export const selectCache = createFeatureSelector<CacheStoreInterface>('cache');

export const selectKnownUploaders = createSelector(
    selectCache,
    ({ knownUploaders }) => knownUploaders,
);
