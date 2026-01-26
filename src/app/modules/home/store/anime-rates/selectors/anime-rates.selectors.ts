import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AnimeRatesStoreInterface } from '@app/modules/home/store/anime-rates/types';
import { ExtendedUserRateStatusType } from '@app/modules/home/types';

export const selectAnimeRates = createFeatureSelector<AnimeRatesStoreInterface>('animeRates');

export const selectRates = createSelector(
    selectAnimeRates,
    ({ rates }) => rates,
);

export const selectIsRatesLoading = createSelector(
    selectAnimeRates,
    ({ isRatesLoading }) => isRatesLoading,
);

export const selectUserRatesByStatus = (status: ExtendedUserRateStatusType) => createSelector(
    selectAnimeRates,
    ({ rates }) => rates.filter(({ status: rateStatus }) => rateStatus === status),
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
