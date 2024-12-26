import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';
import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';
import { getMostPopularPreference } from '@app/shared/utils/get-most-popular-preference.function';
import { mapPreferenceValue } from '@app/shared/utils/map-preference-value.function';

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

export const selectAuthorPreferences = createSelector(
    selectSettings,
    (state) => state.authorPreferences,
);

export const selectAuthorPreferencesByAnime = (animeId: ResourceIdType) => createSelector(
    selectAuthorPreferences,
    (authorPreferences) => mapPreferenceValue(
        authorPreferences[animeId] ?? getMostPopularPreference(authorPreferences, cleanAuthorName),
    ),
);

export const selectKindPreferences = createSelector(
    selectSettings,
    (state) => state.kindPreferences,
);

export const selectKindPreferencesByAnime = (animeId: ResourceIdType) => createSelector(
    selectKindPreferences,
    (kindPreferences) => mapPreferenceValue(
        kindPreferences[animeId] ?? getMostPopularPreference(kindPreferences),
    ),
);

export const selectDomainPreferences = createSelector(
    selectSettings,
    (state) => state.domainPreferences,
);

export const selectDomainPreferencesByAnime = (animeId: ResourceIdType) => createSelector(
    selectDomainPreferences,
    (domainPreferences) => mapPreferenceValue(
        domainPreferences[animeId] ?? getMostPopularPreference(domainPreferences),
    ),
);

export const selectTheme = createSelector(
    selectSettings,
    (state) => state.theme || 'dark',
);
