import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AnimeRatesStoreInterface } from '@app/modules/home/store/anime-rates/types';
import { entityMapToArray } from '@app/shared/utils/entities.utils';

export const selectAnimeRates = createFeatureSelector<AnimeRatesStoreInterface>('animeRates');

export const selectRates = createSelector(
    selectAnimeRates,
    ({ rates }) => entityMapToArray(rates),
);

export const selectIsRatesLoading = createSelector(
    selectAnimeRates,
    ({ isRatesLoading }) => isRatesLoading,
);

export const selectRatesMetadata = createSelector(
    selectAnimeRates,
    ({ metadata }) => metadata,
);

export const selectIsMetadataLoading = createSelector(
    selectAnimeRates,
    ({ metaSize }) => metaSize > 0,
);
