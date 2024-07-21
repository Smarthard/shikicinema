import {
    MetaReducer,
    createReducer,
    on,
} from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { PlayerStoreInterface } from '@app/modules/player/store/types';
import {
    addVideosAction,
    getAnimeInfoSuccessAction,
    watchAnimeSuccessAction,
} from '@app/modules/player/store/actions';

const initialState: PlayerStoreInterface = {
    videos: {},
    animeInfo: {},
};

export const reducers = createReducer(initialState,
    on(
        addVideosAction,
        (state, { animeId, videos }) => ({
            ...state,
            videos: {
                ...state.videos,
                [animeId]: [...state.videos[animeId] || [], ...videos],
            },
        }),
    ),
    on(
        getAnimeInfoSuccessAction,
        (state, { anime }) => ({
            ...state,
            animeInfo: {
                ...state.animeInfo,
                [anime.id]: anime,
            },
        }),
    ),
    on(
        watchAnimeSuccessAction,
        (state, { userRate }) => ({
            ...state,
            animeInfo: {
                ...state.animeInfo,
                [userRate.target_id]: {
                    ...state.animeInfo[userRate.target_id],
                    user_rate: userRate,
                } as AnimeBriefInfoInterface,
            },
        }),
    ),
);


export const metaReducers: MetaReducer<PlayerStoreInterface>[] = [];
