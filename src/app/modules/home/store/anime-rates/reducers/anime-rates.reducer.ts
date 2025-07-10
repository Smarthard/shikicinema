import { createReducer, on } from '@ngrx/store';

import { AnimeRatesStoreInterface } from '@app/modules/home/store/anime-rates/types';
import { entityArrayToMap } from '@app/shared/utils/entities.utils';
import {
    getAnimeRatesMetadataAction,
    getAnimeRatesMetadataSuccessAction,
    loadAllUserAnimeRatesSuccessAction,
} from '@app/modules/home/store/anime-rates/actions';

const initialState: AnimeRatesStoreInterface = {
    rates: {},
    isRatesLoading: true,
    metadata: {},
    metaSize: 0,
};

const reducer = createReducer(
    initialState,
    on(
        loadAllUserAnimeRatesSuccessAction,
        (state, { rates }) => ({
            ...state,
            isRatesLoading: false,
            rates: entityArrayToMap(rates),
        }),
    ),
    on(
        getAnimeRatesMetadataAction,
        (state, { animeIds }) => ({
            ...state,
            metaSize: (state.metaSize || 0) + (animeIds?.length || 0),
        }),
    ),
    on(
        getAnimeRatesMetadataSuccessAction,
        (state, { metadata }) => ({
            ...state,
            metadata: {
                ...state?.metadata,
                ...entityArrayToMap(metadata),
            },
            metaSize: (state.metaSize || 0) - (metadata?.length || 0),
        }),
    ),
);

export function animeRatesReducer(state, action) {
    return reducer(state, action);
}
