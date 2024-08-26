import { NoPreferenceSymbol, PreferencesInterface, PreferencesValueType } from '@app/store/settings/types';

export function getMostPopularPreference<T>(
    preferences: PreferencesInterface<T>,
    clearFn?: (raw: PreferencesValueType<T>) => PreferencesValueType<T>,
): PreferencesValueType<T> {
    const counterMap = new Map<PreferencesValueType<T>, number>();
    let topCounter = -1;
    let topPref: PreferencesValueType<T> = NoPreferenceSymbol;

    for (const rawPref of Object.values(preferences)) {
        const pref = clearFn ? clearFn(rawPref) : rawPref;
        let count = counterMap.get(pref) || 0;

        counterMap.set(pref, ++count);

        if (count > topCounter) {
            topCounter = count;
            topPref = pref;
        }
    }

    return topPref;
}
