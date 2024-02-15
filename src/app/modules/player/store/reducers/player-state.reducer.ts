import {
    MetaReducer,
    createReducer,
    on,
} from '@ngrx/store';

import { PlayerStoreInterface } from '@app/modules/player/store/types';
import { addVideosAction } from '@app/modules/player/store/actions';

const initialState: PlayerStoreInterface = {
    videos: {},
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
);


export const metaReducers: MetaReducer<PlayerStoreInterface>[] = [];
