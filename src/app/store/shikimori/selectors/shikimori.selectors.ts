import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ShikimoriStoreInterface } from '@app/store/shikimori/types/shikimori-store.interface';

export const shikimoriFeatureSelector = createFeatureSelector<ShikimoriStoreInterface>('shikimori');

export const shikimoriCurrentUserSelector = createSelector(
    shikimoriFeatureSelector,
    (state) => state.currentUser,
);

export const isShikimoriCurrentUserLoadingSelector = createSelector(
    shikimoriFeatureSelector,
    (state) => state.isCurrentUserLoading,
);
