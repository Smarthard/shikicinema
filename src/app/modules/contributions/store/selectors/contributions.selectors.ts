import { createFeatureSelector, createSelector } from '@ngrx/store';

import ContributionsStoreInterface from '@app/modules/contributions/store/types/contributions-store.interface';

export const selectContributionsFeature = createFeatureSelector<ContributionsStoreInterface>('contributions');

export const selectContributions = createSelector(
    selectContributionsFeature,
    ({ contributions }) => contributions,
);

export const selectUploaderId = createSelector(
    selectContributionsFeature,
    ({ uploaderId }) => uploaderId,
);
