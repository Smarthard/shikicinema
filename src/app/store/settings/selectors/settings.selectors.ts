import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';

export const settingsFeatureSelector = createFeatureSelector<SettingsStoreInterface>('settings');

export const languageSelector = createSelector(
    settingsFeatureSelector,
    (state) => state.language,
);

export const availableLanguagesSelector = createSelector(
    settingsFeatureSelector,
    (state) => state.availableLangs,
);
