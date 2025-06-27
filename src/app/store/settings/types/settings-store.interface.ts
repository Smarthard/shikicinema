import { PlayerKindDisplayMode } from '@app/store/settings/types/player-kind-display-mode.type';
import { PlayerModeType } from '@app/store/settings/types/player-mode.type';
import { PreferencesInterface } from '@app/store/settings/types/preferences.interface';
import { ThemeSettingsType } from '@app/store/settings/types/theme-settings.type';

export interface SettingsStoreInterface {
    language: string;
    theme: ThemeSettingsType;
    customTheme: string;
    preferencesToggle: boolean;
    playerMode: PlayerModeType;
    playerKindDisplayMode: PlayerKindDisplayMode;
    availableLangs: string[];
    animePaginationSize: number;
    authorPreferences: PreferencesInterface<string>;
    kindPreferences: PreferencesInterface<string>;
    domainPreferences: PreferencesInterface<string>;
    lastPage: string;
    useCustomAnimeStatusOrder: boolean;
    userAnimeStatusOrder: string[];
    filterPlayerDomains: string[]
}
