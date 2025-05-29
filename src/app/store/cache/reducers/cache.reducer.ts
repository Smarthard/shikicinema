import { createReducer, on } from '@ngrx/store';

import { CacheStoreInterface } from '@app/store/cache/types';
import { WELL_KNOWN_UPLOADERS_MAP } from '@app/shared/config/well-known-uploaders.config';
import {
    cacheHealthCheckUpSuccessAction,
    resetCacheAction,
    updateAnimesCacheAction,
    updateCacheAction,
    updateUploadersCacheAction,
} from '@app/store/cache/actions';
import { getAnimeCacheTtl } from '@app/store/cache/utils';
import { getUserRateSuccessAction, watchAnimeSuccessAction } from '@app/modules/player/store/actions';

const initialState: CacheStoreInterface = {
    knownUploaders: WELL_KNOWN_UPLOADERS_MAP,
    animes: {},
    lastCheckUp: '1970-01-01T00:00:00.000Z',
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
                [anime.id]: {
                    anime,
                    ttl: getAnimeCacheTtl(anime),
                },
            },
        }),
    ),
    on(
        watchAnimeSuccessAction,
        getUserRateSuccessAction,
        (state, { userRate, animeId }) => ({
            ...state,
            animes: {
                ...state.animes,
                [animeId]: {
                    ...state.animes[animeId],
                    anime: {
                        ...state.animes[animeId].anime,
                        user_rate: userRate,
                    },
                },
            },
        }),
    ),
    on(
        cacheHealthCheckUpSuccessAction,
        (state, { animes }) => ({
            ...state,
            animes,
            lastCheckUp: new Date().toISOString(),
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
