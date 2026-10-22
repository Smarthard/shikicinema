import { NoPreferenceSymbol } from '@app/store/settings/types/no-preference.symbol';
import { PlayerPreferenceEntry } from '@app/store/settings/types/player-preference.interface';

type PreferenceKey = keyof PlayerPreferenceEntry;

export function getMostFrequentPreference<T>(
    entries: PlayerPreferenceEntry[],
    key: PreferenceKey,
): T | typeof NoPreferenceSymbol {
    if (!entries?.length) return NoPreferenceSymbol;

    const topEntry = entries.reduce((max, entry) => entry.watches > max.watches ? entry : max, entries[0]);

    return topEntry[key] as T;
}
