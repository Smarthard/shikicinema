import { createReducer, on } from '@ngrx/store';

import { ShikimoriStoreInterface } from '@app/store/shikimori/types/shikimori-store.interface';
import {
    findAnimeAction,
    findAnimeFailureAction,
    findAnimeSuccessAction, resetFoundAnimeAction,
} from '@app/store/shikimori/actions/find-anime.action';
import {
    getCurrentUserAction,
    getCurrentUserFailureAction,
    getCurrentUserSuccessAction,
} from '@app/store/shikimori/actions/get-current-user.action';
import { updateShikimoriDomainAction } from '@app/store/shikimori/actions';

const initialState: ShikimoriStoreInterface = {
    isCurrentUserLoading: false,
    currentUser: null,
    isAnimeSearchLoading: false,
    foundAnimes: null,
    shikimoriDomain: null,
    errors: null,
};

const reducer = createReducer(
    initialState,
    on(
        getCurrentUserAction,
        (state) => ({
            ...state,
            isCurrentUserLoading: true,
        }),
    ),
    on(
        getCurrentUserSuccessAction,
        (state, { currentUser }) => ({
            ...state,
            currentUser,
        }),
    ),
    on(
        getCurrentUserFailureAction,
        (state) => ({
            ...state,
            currentUser: null,
        }),
    ),
    on(
        getCurrentUserSuccessAction,
        getCurrentUserFailureAction,
        (state) => ({
            ...state,
            isCurrentUserLoading: false,
        }),
    ),
    on(
        resetFoundAnimeAction,
        (state) => ({
            ...state,
            foundAnimes: null,
        }),
    ),
    on(
        findAnimeAction,
        (state) => ({
            ...state,
            isAnimeSearchLoading: true,
        }),
    ),
    on(
        findAnimeSuccessAction,
        (state, { animes }) => ({
            ...state,
            foundAnimes: animes,
        }),
    ),
    on(
        findAnimeFailureAction,
        (state, { errors }) => ({
            ...state,
            errors,
        }),
    ),
    on(
        findAnimeSuccessAction,
        findAnimeFailureAction,
        resetFoundAnimeAction,
        (state) => ({
            ...state,
            isAnimeSearchLoading: false,
        }),
    ),
    on(
        updateShikimoriDomainAction,
        (state, { domain }) => ({
            ...state,
            shikimoriDomain: domain,
        }),
    ),
);

export function shikimoriReducer(state, action) {
    return reducer(state, action);
}
