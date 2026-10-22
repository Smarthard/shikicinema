import { createFeatureSelector, createSelector } from '@ngrx/store';

import { DEFAULT_ANIME_STATUS_ORDER } from '@app/shared/config/default-anime-status-order.config';
import { ExtendedUserRateStatusType } from '@app/modules/home/types';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { PreferencesValueType, SettingsStoreInterface } from '@app/store/settings/types';
import { getMostFrequentPreference } from '@app/shared/utils/get-most-frequent-preference.function';
import { VideoKindEnum } from '@app/modules/player/types';

export const selectSettings = createFeatureSelector<SettingsStoreInterface>('settings');

export const selectLanguage = createSelector(
    selectSettings,
    (state) => state.language,
);

export const selectAvailableLanguages = createSelector(
    selectSettings,
    (state) => state.availableLangs,
);

export const selectPlayerPreferences = createSelector(
    selectSettings,
    ({ playerPreferences }) => playerPreferences,
);

export const selectAllPlayerPreferences = createSelector(
    selectPlayerPreferences,
    (preferences) => Object.values(preferences ?? {})?.flat() ?? [],
);

export const selectPreferencesByAnimeId = (animeId: ResourceIdType) => createSelector( 
    selectPlayerPreferences,
    (preferences) => preferences?.[animeId]
);

export const selectAuthorPreferencesByAnime = (animeId: ResourceIdType) => createSelector(
    selectPreferencesByAnimeId(animeId),
    selectAllPlayerPreferences,
    (animePrefs, allPrefs) => {
        const latest = animePrefs?.[0]?.author as PreferencesValueType<string>;
        const preferences = (animePrefs?.length ? animePrefs : allPrefs) ?? [];

        return latest ?? getMostFrequentPreference<string>(preferences, 'author');
    },
);

export const selectKindPreferencesByAnime = (animeId: ResourceIdType) => createSelector(
    selectPreferencesByAnimeId(animeId),
    selectAllPlayerPreferences,
    (animePrefs, allPrefs) => {
        const latest = animePrefs?.[0]?.kind as PreferencesValueType<VideoKindEnum>;
        const preferences = (animePrefs?.length ? animePrefs : allPrefs) ?? [];

        return latest ?? getMostFrequentPreference<VideoKindEnum>(preferences, 'kind');
    },
);

export const selectDomainPreferencesByAnime  = (animeId: ResourceIdType) => createSelector(
    selectPreferencesByAnimeId(animeId),
    selectAllPlayerPreferences,
    (animePrefs, allPrefs) => {
        const latest = animePrefs?.[0]?.domain as PreferencesValueType<string>;
        const preferences = (animePrefs?.length ? animePrefs : allPrefs) ?? [];

        return latest ?? getMostFrequentPreference<string>(preferences, 'domain');
    },
);

export const selectTheme = createSelector(
    selectSettings,
    (state) => state.theme || 'dark',
);

export const selectCustomTheme = createSelector(
    selectSettings,
    (state) => state.customTheme || '',
);

export const selectPreferencesToggle = createSelector(
    selectSettings,
    (state) => state.preferencesToggle,
);

export const selectPlayerMode = createSelector(
    selectSettings,
    (state) => state.playerMode || 'compact',
);

export const selectPlayerKindDisplayMode = createSelector(
    selectSettings,
    (state) => state.playerKindDisplayMode || 'special-only',
);

export const selectLastVisitedPage = createSelector(
    selectSettings,
    (state) => state.lastPage,
);

export const selectDomainFilters = createSelector(
    selectSettings,
    (state) => state.filterPlayerDomains,
);

export const selectAnimeStatusOrder = createSelector(
    selectSettings,
    ({ useCustomAnimeStatusOrder, userAnimeStatusOrder }) => (useCustomAnimeStatusOrder
        ? userAnimeStatusOrder
        : DEFAULT_ANIME_STATUS_ORDER) as ExtendedUserRateStatusType[],
);
