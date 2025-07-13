import { PlayerKindDisplayMode, PlayerModeType, ThemeSettingsType } from '@app/store/settings/types';

export interface SettingsFormInterface {
    language: string;
    theme: ThemeSettingsType;
    customTheme: string;
    preferencesToggle: boolean;
    playerMode: PlayerModeType;
    playerKindDisplayMode: PlayerKindDisplayMode;
    shikimoriDomain: string;
    isUserAnimeStatusReorder: boolean;
    userAnimeStatusOrder: string[];
}
