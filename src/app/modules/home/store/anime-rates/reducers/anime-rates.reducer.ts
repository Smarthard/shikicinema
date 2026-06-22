import { createReducer, on } from '@ngrx/store';

import { AnimeRatesStoreInterface } from '@app/modules/home/store/anime-rates/types';
import {
    changeAnimeRatesFiltersAction,
    getSortedRatesAction,
    getSortedRatesSuccessAction,
    loadAllUserAnimeRatesAction,
    loadAllUserAnimeRatesSuccessAction,
    loadGenresAction,
    loadGenresFailureAction,
    loadGenresSuccessAction,
    loadStudiosAction,
    loadStudiosFailureAction,
    loadStudiosSuccessAction,
    pageLoadSuccessAction,
    toggleAnimeFiltersAction,
} from '@app/modules/home/store/anime-rates/actions';
import { filterDuplicatedIds } from '@app/shared/utils/filter-duplicated-ids.function';

const initialState: AnimeRatesStoreInterface = {
    rawRates: [],
    isRawRatesLoading: true,
    isRatesLoading: true,
    rates: [],

    isFiltersOpen: false,
    filters: {
        sort: 'user_score',
        order: 'DESC',
    },

    isGenresLoading: true,
    genres: [],

    isStudiosLoading: true,
    studios: [],
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
            isRawRatesLoading: false,
        }),
    ),
    on(
        pageLoadSuccessAction,
        (state, { rates }) => ({
            ...state,
            rawRates: [
                ...state.rawRates,
                ...rates,
            ].filter(filterDuplicatedIds()),
        }),
    ),
    on(
        getSortedRatesAction,
        (state) => ({
            ...state,
            isRatesLoading: true,
        }),
    ),
    on(
        getSortedRatesSuccessAction,
        (state, { rates }) => ({
            ...state,
            rates: rates,
            isRatesLoading: false,
        }),
    ),
    on(
        changeAnimeRatesFiltersAction,
        (state, { filters }) => ({
            ...state,
            filters,
        }),
    ),
    on(
        loadGenresAction,
        (state) => ({
            ...state,
            isGenresLoading: true,
        }),
    ),
    on(
        loadGenresSuccessAction,
        (state, { genres }) => ({
            ...state,
            isGenresLoading: false,
            genres,
        }),
    ),
    on(
        loadGenresFailureAction,
        (state) => ({
            ...state,
            isGenresLoading: false,
            genres: [],
        }),
    ),
    on(
        loadStudiosAction,
        (state) => ({
            ...state,
            isStudiosLoading: true,
        }),
    ),
    on(
        loadStudiosSuccessAction,
        (state, { studios }) => ({
            ...state,
            isStudiosLoading: false,
            studios,
        }),
    ),
    on(
        loadStudiosFailureAction,
        (state) => ({
            ...state,
            isStudiosLoading: false,
            studios: [],
        }),
    ),
    on(
        toggleAnimeFiltersAction,
        (state) => ({
            ...state,
            isFiltersOpen: !state.isFiltersOpen,
        }),
    ),
);

export function animeRatesReducer(state, action) {
    return reducer(state, action);
}
