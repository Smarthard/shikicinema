import { createReducer, on } from '@ngrx/store';

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

const initialState: SettingsStoreInterface = {
    language: '',
    theme: 'dark',
    customTheme: '',
    preferencesToggle: true,
    playerMode: 'auto',
    playerKindDisplayMode: 'special-only',
    availableLangs: defaultAvailableLangs,
    animePaginationSize: 100,
    authorPreferences: {},
    kindPreferences: {},
    domainPreferences: {},
    lastPage: '/home',
    useCustomAnimeStatusOrder: false,
    userAnimeStatusOrder: DEFAULT_ANIME_STATUS_ORDER,
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
        (state, { animeId, author, kind, domain }) => ({
            ...state,
            authorPreferences: {
                ...state.authorPreferences,
                [animeId]: author,
            },
            kindPreferences: {
                ...state.kindPreferences,
                [animeId]: kind,
            },
            domainPreferences: {
                ...state.domainPreferences,
                [animeId]: domain,
            },
        }),
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
            playerMode: state.playerMode === 'compact'
                ? 'full' as const
                : 'compact' as const,
        }),
    ),
);

export function settingsReducer(state, action) {
    return reducer(state, action);
}
