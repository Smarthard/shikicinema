import { createReducer, on } from '@ngrx/store';

import RecentAnimesStoreInterface from '@app/modules/home/store/recent-animes/types/recent-animes-store.interface';
import { visitAnimePageAction } from '@app/modules/home/store/recent-animes/actions/recent-animes.actions';

const initialState: RecentAnimesStoreInterface = {
    recentAnimes: {},
};

const reducer = createReducer(
    initialState,
    on(
        visitAnimePageAction,
        (state, { anime, episode }) => ({
            ...state,
            recentAnimes: {
                ...state.recentAnimes,
                [anime.id]: {
                    episode,
                    visited: new Date().toISOString(),
                },
            },
        }),
    ),
);

export function recentAnimesReducer(state, action) {
    return reducer(state, action);
}
