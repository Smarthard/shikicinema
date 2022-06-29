import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';

export const selectSettings = createFeatureSelector<SettingsStoreInterface>('settings');

export const selectLanguage = createSelector(
    selectSettings,
    (state) => state.language,
);

export const selectAvailableLanguages = createSelector(
    selectSettings,
    (state) => state.availableLangs,
);

export const selectAnimePaginationSize = createSelector(
    selectSettings,
    (state) => state.animePaginationSize,
);
