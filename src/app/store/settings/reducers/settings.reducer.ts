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
import { PlayerPreferenceEntry } from '@app/store/settings/types';
import { getDomain } from '@app/shared/utils/get-domain.function';

const MAX_PREFERENCES = 20;

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
            const { url, kind, author } = video;
            const domain = getDomain(url);
            const allAnimePrefs = state.playerPreferences[animeId] ?? [];

            const index = allAnimePrefs.findIndex(
                (rec) => rec.author === author &&
                       rec.kind === kind &&
                       rec.domain === domain,
            );
            const oldPref = index >= 0 ? allAnimePrefs?.[index] : null;

            let newEntries: PlayerPreferenceEntry[];

            if (oldPref) {
                newEntries = allAnimePrefs.map((p) =>
                    p === oldPref
                        ? { ...oldPref, watches: oldPref.watches + 1, lastWatchedAt: Date.now() }
                        : p,
                );
            } else {
                const newEntry: PlayerPreferenceEntry = {
                    author,
                    kind,
                    domain,
                    watches: 1,
                    lastWatchedAt: Date.now(),
                };

                newEntries = [newEntry, ...allAnimePrefs].slice(0, MAX_PREFERENCES);
            }

            return {
                ...state,
                playerPreferences: {
                    ...state.playerPreferences,
                    [animeId]: newEntries,
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
