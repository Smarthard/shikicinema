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

export const selectShikimoriCurrentUserAvatar = createSelector(
    selectShikimori,
    (state) => state.currentUser?.image?.x80 || state.currentUser?.image?.x64 || state.currentUser?.avatar,
);

export const selectShikimoriCurrentUserAvatarHiRes = createSelector(
    selectShikimori,
    (state) => state.currentUser?.image?.x160 || state.currentUser?.image?.x148 || state.currentUser?.avatar,
);

export const selectShikimoriCurrentUserNickname = createSelector(
    selectShikimori,
    (state) => state.currentUser?.nickname,
);

export const selectShikimoriCurrentUserProfileLink = createSelector(
    selectShikimori,
    (state) => state.currentUser?.url,
);
