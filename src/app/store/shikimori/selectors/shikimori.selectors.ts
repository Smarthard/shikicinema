import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ShikimoriStoreInterface } from '@app/store/shikimori/types/shikimori-store.interface';
import { UserBriefInfoInterface } from '@app/shared/types/shikimori';

export const selectShikimori = createFeatureSelector<ShikimoriStoreInterface>('shikimori');

export const selectShikimoriCurrentUser = createSelector(
    selectShikimori,
    ({ currentUser }) => currentUser ?? {} as UserBriefInfoInterface,
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
    ({ foundAnimes }) => foundAnimes,
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
    ({ shikimoriDomain }) => shikimoriDomain,
);
