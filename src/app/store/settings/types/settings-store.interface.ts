import { PlayerKindDisplayMode } from '@app/store/settings/types/player-kind-display-mode.type';
import { PlayerModeType } from '@app/store/settings/types/player-mode.type';
import { PlayerPreferencesInterface } from '@app/store/settings/types/player-preference.interface';
import { ThemeSettingsType } from '@app/store/settings/types/theme-settings.type';

export interface SettingsStoreInterface {
    language: string;
    theme: ThemeSettingsType;
    customTheme: string;
    preferencesToggle: boolean;
    playerMode: PlayerModeType;
    playerKindDisplayMode: PlayerKindDisplayMode;
    availableLangs: string[];
    playerPreferences: PlayerPreferencesInterface;
    lastPage: string;
    useCustomAnimeStatusOrder: boolean;
    userAnimeStatusOrder: string[];
    filterPlayerDomains: string[]
}
