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

export const selectShikimoriCurrentUserId = createSelector(
    selectShikimoriCurrentUser,
    (currentUser) => currentUser?.id,
);

export const selectShikimoriCurrentUserAvatar = createSelector(
    selectShikimoriCurrentUser,
    (currentUser) => currentUser?.image?.x80 || currentUser?.image?.x64 || currentUser?.avatar,
);

export const selectShikimoriCurrentUserAvatarHiRes = createSelector(
    selectShikimoriCurrentUser,
    (currentUser) => currentUser?.image?.x160 || currentUser?.image?.x148 || currentUser?.avatar,
);

export const selectShikimoriCurrentUserNickname = createSelector(
    selectShikimoriCurrentUser,
    (currentUser) => currentUser?.nickname,
);

export const selectShikimoriCurrentUserProfileLink = createSelector(
    selectShikimoriCurrentUser,
    (currentUser) => currentUser?.url,
);

export const selectShikimoriDomain = createSelector(
    selectShikimori,
    (state) => state.shikimoriDomain,
);
