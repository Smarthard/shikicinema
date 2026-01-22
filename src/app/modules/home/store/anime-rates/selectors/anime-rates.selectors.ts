import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AnimeRatesStoreInterface } from '@app/modules/home/store/anime-rates/types';
import { ExtendedUserRateStatusType } from '@app/modules/home/types';
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

export const selectIsUserRateSectionLoaded = (section: ExtendedUserRateStatusType) => createSelector(
    selectAnimeRates,
    ({ rates, metadata }) => {
        if (section === 'recent') {
            return true;
        };

        const sectionRatesIds = entityMapToArray(rates)
            .filter(({ status }) => status === section)
            .map(({ target_id: id }) => id);

        return sectionRatesIds.every((id) => metadata?.[id]);
    },
);

export const selectUserRateSectionSize = (section: ExtendedUserRateStatusType) => createSelector(
    selectAnimeRates,
    ({ rates }) => entityMapToArray(rates)
        .filter(({ status }) => status === section)
        .length || 50,
);
