import { NoPreferenceSymbol } from '@app/store/settings/types/no-preference.symbol';

export type PreferencesValueType<T> = T | typeof NoPreferenceSymbol;
