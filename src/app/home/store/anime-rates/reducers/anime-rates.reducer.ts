import { createReducer, on } from '@ngrx/store';

import AnimeRatesStoreInterface from '@app/home/store/anime-rates/types/anime-rates-store.interface';
import {
    allPagesLoadedForStatusAction,
    incrementPageForStatusAction,
} from '@app/home/store/anime-rates/actions/anime-rate-paging.actions';
import {
    getRateLoadedKey,
    getRatePageKey,
    getRateStoreKey,
} from '@app/home/store/anime-rates/helpers/anime-rates-store-key.helpers';
import { loadAnimeRateByStatusSuccessAction } from '@app/home/store/anime-rates/actions/load-anime-rate.action';

const initialState: AnimeRatesStoreInterface = {
    planned: [],
    watching: [],
    rewatching: [],
    completed: [],
    onHold: [],
    dropped: [],
    plannedPage: 1,
    watchingPage: 1,
    completedPage: 1,
    rewatchingPage: 1,
    onHoldPage: 1,
    droppedPage: 1,
    isCompletedLoaded: false,
    isDroppedLoaded: false,
    isOnHoldLoaded: false,
    isPlannedLoaded: false,
    isRewatchingLoaded: false,
    isWatchingLoaded: false,
};

const reducer = createReducer(
    initialState,
    on(
        allPagesLoadedForStatusAction,
        (state, { status }) => ({
            ...state,
            [getRateLoadedKey(status)]: true,
        }),
    ),
    on(
        loadAnimeRateByStatusSuccessAction,
        (state, { status, rates }) => ({
            ...state,
            [getRateStoreKey(status)]: rates,
        }),
    ),
    on(
        incrementPageForStatusAction,
        (state, { status }) => ({
            ...state,
            [getRatePageKey(status)]: state[getRatePageKey(status)] + 1,
        }),
    ),
);

export function animeRatesReducer(state, action) {
    return reducer(state, action);
}
