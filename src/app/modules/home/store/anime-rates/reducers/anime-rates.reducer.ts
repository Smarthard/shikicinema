import { createReducer, on } from '@ngrx/store';

import { AnimeRatesStoreInterface } from '@app/modules/home/store/anime-rates/types';
import { filterDuplicatedIds } from '@app/shared/utils/filter-duplicated-ids.function';
import {
    loadAllUserAnimeRatesAction,
    loadAllUserAnimeRatesSuccessAction,
    pageLoadSuccessAction,
} from '@app/modules/home/store/anime-rates/actions';

const initialState: AnimeRatesStoreInterface = {
    rates: [],
    isRatesLoading: true,
};

const reducer = createReducer(
    initialState,
    on(
        loadAllUserAnimeRatesAction,
        () => ({ ...initialState }),
    ),
    on(
        loadAllUserAnimeRatesSuccessAction,
        (state) => ({
            ...state,
            isRatesLoading: false,
        }),
    ),
    on(
        pageLoadSuccessAction,
        (state, { rates }) => ({
            ...state,
            rates: [
                ...state.rates,
                ...rates,
            ].filter(filterDuplicatedIds),
        }),
    ),
);

export function animeRatesReducer(state, action) {
    return reducer(state, action);
}
