import { createFeatureSelector, createSelector } from '@ngrx/store';

import AuthStoreInterface from '@app/store/auth/types/auth-store.interface';

export const selectFeatureAuth = createFeatureSelector<AuthStoreInterface>('auth');


export const selectShikimoriBearerToken = createSelector(
    selectFeatureAuth,
    (state) => state.shikimoriBearerToken,
);

export const selectShikimoriRefreshToken = createSelector(
    selectFeatureAuth,
    (state) => state.shikimoriRefreshToken,
);

export const selectIsAuthenticated = createSelector(
    selectFeatureAuth,
    (state) => Boolean(state.shikimoriBearerToken && state.accessExpireTimeMs > Date.now()),
);

export const selectIsRefreshable = createSelector(
    selectFeatureAuth,
    (state) => Boolean(state.shikimoriRefreshToken && state.refreshExpireTimeMs > Date.now()),
);
