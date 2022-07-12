import { createReducer, on } from '@ngrx/store';

import { ShikimoriStoreInterface } from '@app/store/shikimori/types/shikimori-store.interface';
import {
    getCurrentUserAction,
    getCurrentUserFailureAction,
    getCurrentUserSuccessAction,
} from '@app/store/shikimori/actions/get-current-user.action';
import {
    findAnimeAction,
    findAnimeFailureAction,
    findAnimeSuccessAction, resetFoundAnimeAction
} from '@app/store/shikimori/actions/find-anime.action';

const initialState: ShikimoriStoreInterface = {
    isCurrentUserLoading: false,
    currentUser: null,
    isAnimeSearchLoading: false,
    foundAnimes: null,
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
);

export function shikimoriReducer(state, action) {
    return reducer(state, action);
}
