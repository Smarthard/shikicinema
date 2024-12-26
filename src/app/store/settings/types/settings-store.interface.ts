import { PreferencesInterface } from '@app/store/settings/types/preferences.interface';

export interface SettingsStoreInterface {
    language: string;
    theme: 'light' | 'dark';
    availableLangs: string[];
    animePaginationSize: number;
    authorPreferences: PreferencesInterface<string>;
    kindPreferences: PreferencesInterface<string>;
    domainPreferences: PreferencesInterface<string>;
}
