import { NoPreferenceSymbol, PreferencesValueType } from '@app/store/settings/types';

export function mapPreferenceValue<T>(value: PreferencesValueType<T>): PreferencesValueType<T> {
    return value !== undefined ? value : NoPreferenceSymbol;
}
