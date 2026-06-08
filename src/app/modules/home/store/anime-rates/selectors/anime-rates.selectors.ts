import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AnimeRatesStoreInterface } from '@app/modules/home/store/anime-rates/types';
import { ExtendedUserRateStatusType } from '@app/modules/home/types';

export const selectAnimeRates = createFeatureSelector<AnimeRatesStoreInterface>('animeRates');

export const selectRawRates = createSelector(
    selectAnimeRates,
    ({ rawRates }) => rawRates,
);

export const selectRates = createSelector(
    selectAnimeRates,
    ({ rates }) => rates,
);

export const selectIsRawRatesLoading = createSelector(
    selectAnimeRates,
    ({ isRawRatesLoading }) => isRawRatesLoading,
);

export const selectIsRatesLoading = createSelector(
    selectAnimeRates,
    ({ isRatesLoading }) => isRatesLoading,
);

export const selectUserRatesByStatus = (status: ExtendedUserRateStatusType) => createSelector(
    selectRates,
    (rates) => rates.filter(({ status: rateStatus }) => rateStatus === status),
);

export const selectIsUserRateSectionLoading = (section: ExtendedUserRateStatusType) => createSelector(
    selectAnimeRates,
    ({ isRatesLoading }) => {
        if (section === 'recent') {
            return false;
        };

        return isRatesLoading;
    },
);

export const selectUserRateSectionSize = (section: ExtendedUserRateStatusType) => createSelector(
    selectUserRatesByStatus(section),
    (sectionRates) => sectionRates.length || 50,
);

export const selectIsFiltersOpen = createSelector(
    selectAnimeRates,
    ({ isFiltersOpen }) => isFiltersOpen,
)

export const selectRatesFilters = createSelector(
    selectAnimeRates,
    ({ filters }) => filters,
);

export const selectIsGenresLoading = createSelector(selectAnimeRates, ({ isGenresLoading }) => isGenresLoading);
export const selectGenres = createSelector(selectAnimeRates, ({ genres }) => genres);

export const selectIsStudiosLoading = createSelector(selectAnimeRates, ({ isStudiosLoading }) => isStudiosLoading);
export const selectStudios = createSelector(selectAnimeRates, ({ studios }) => studios);
