import {
    MetaReducer,
    createReducer,
    on,
} from '@ngrx/store';

import { PlayerStoreInterface } from '@app/modules/player/store/types';
import { addVideosAction, getAnimeInfoSuccessAction } from '@app/modules/player/store/actions';

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
                [animeId]: [...state.videos[animeId] || [], ...videos],
            },
        }),
    ),
    on(
        getAnimeInfoSuccessAction,
        (state, { anime }) => ({
            ...state,
            animeInfo: {
                [anime.id]: anime,
            },
        }),
    ),
);


export const metaReducers: MetaReducer<PlayerStoreInterface>[] = [];
