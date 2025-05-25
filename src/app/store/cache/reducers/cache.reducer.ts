import { createReducer, on } from '@ngrx/store';

import { CacheStoreInterface } from '@app/store/cache/types';
import { WELL_KNOWN_UPLOADERS_MAP } from '@app/shared/config/well-known-uploaders.config';
import {
    resetCacheAction,
    updateAnimesCacheAction,
    updateCacheAction,
    updateUploadersCacheAction,
} from '@app/store/cache/actions';

const initialState: CacheStoreInterface = {
    knownUploaders: WELL_KNOWN_UPLOADERS_MAP,
    animes: {},
};

const reducer = createReducer(
    initialState,
    on(
        updateCacheAction,
        (state, { key, value }) => ({
            ...state,
            [key]: value,
        }),
    ),
    on(
        updateUploadersCacheAction,
        (state, { uploaderId, uploader }) => ({
            ...state,
            knownUploaders: {
                ...state.knownUploaders,
                [uploaderId]: uploader,
            },
        }),
    ),
    on(
        updateAnimesCacheAction,
        (state, { anime }) => ({
            ...state,
            animes: {
                ...state.animes,
                [anime.id]: anime,
            },
        }),
    ),
    on(
        resetCacheAction,
        () => ({ ...initialState }),
    ),
);

export function cacheReducer(state, action) {
    return reducer(state, action);
}
