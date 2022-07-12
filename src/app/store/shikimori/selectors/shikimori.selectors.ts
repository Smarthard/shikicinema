import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ShikimoriStoreInterface } from '@app/store/shikimori/types/shikimori-store.interface';

export const selectShikimori = createFeatureSelector<ShikimoriStoreInterface>('shikimori');

export const selectShikimoriCurrentUser = createSelector(
    selectShikimori,
    (state) => state.currentUser,
);

export const selectIsShikimoriCurrentUserLoading = createSelector(
    selectShikimori,
    (state) => state.isCurrentUserLoading,
);

export const selectShikimoriAnimeSearchLoading = createSelector(
    selectShikimori,
    (state) => state.isAnimeSearchLoading,
);

export const selectShikimoriFoundAnimes = createSelector(
    selectShikimori,
    (state) => state.foundAnimes,
);
