import { Action, createReducer, on } from '@ngrx/store';

import { DEFAULT_ANIME_STATUS_ORDER } from '@app/shared/config/default-anime-status-order.config';
import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';
import { defaultAvailableLangs } from '@app/core/providers/transloco/transloco.provider';
import {
    resetSettingsAction,
    togglePlayerModeAction,
    updateLanguageAction,
    updatePlayerPreferencesAction,
    updateSettingsAction,
    updateThemeAction,
    visitPageAction,
} from '@app/store/settings/actions/settings.actions';
import { upsertPreference } from '@app/store/settings/utils/upsert-preference.function';
import { mapVideoToPreference } from '@app/store/settings/utils/map-video-to-preference.function';

const initialState: SettingsStoreInterface = {
    language: '',
    theme: 'dark',
    customTheme: '',
    preferencesToggle: true,
    playerMode: 'compact',
    playerKindDisplayMode: 'special-only',
    availableLangs: defaultAvailableLangs,
    playerPreferences: {},
    lastPage: '/home',
    useCustomAnimeStatusOrder: false,
    userAnimeStatusOrder: DEFAULT_ANIME_STATUS_ORDER,
    filterPlayerDomains: [],
};

const reducer = createReducer(
    initialState,
    on(
        updateSettingsAction,
        (state, { config }) => ({
            ...state,
            ...config,
        }),
    ),
    on(
        resetSettingsAction,
        () => ({ ...initialState }),
    ),
    on(
        updatePlayerPreferencesAction,
        (state, { animeId, video }) => {
            return {
                ...state,
                playerPreferences: {
                    ...state.playerPreferences,
                    [animeId]: upsertPreference(
                        state.playerPreferences[animeId] ?? [],
                        mapVideoToPreference(video),
                    ),
                },
            };
        },
    ),
    on(
        updateThemeAction,
        (state, { theme }) => ({
            ...state,
            theme,
        }),
    ),
    on(
        updateLanguageAction,
        (state, { language }) => ({
            ...state,
            language,
        }),
    ),
    on(
        visitPageAction,
        (state, { url }) => ({
            ...state,
            lastPage: url,
        }),
    ),
    on(
        togglePlayerModeAction,
        (state) => ({
            ...state,
            playerMode: state.playerMode !== 'full'
                ? 'full' as const
                : 'compact' as const,
        }),
    ),
);

export function settingsReducer(state: SettingsStoreInterface | undefined, action: Action) {
    return reducer(state, action);
}
