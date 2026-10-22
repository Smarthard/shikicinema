import { PlayerPreferenceEntry } from '@app/store/settings/types';
  
const MAX_PREFERENCES = 20;

const isSamePref = (pref: PlayerPreferenceEntry, { author, kind, domain }: PlayerPreferenceEntry): boolean =>
    pref.author === author && pref.kind === kind && pref.domain === domain;

/**
 * Обновляет/создаёт запись о предпочтениях пользователя (watches + 1, lastWatchedAt = now)
 * и поднимает её в начало списка
*/
export const upsertPreference = (
    prefs: PlayerPreferenceEntry[],
    newPref: PlayerPreferenceEntry,
): PlayerPreferenceEntry[] => {
    const index = prefs.findIndex((p) => isSamePref(p, newPref));
    const now = Date.now();

    if (index === -1) {
        const entry: PlayerPreferenceEntry = { ...newPref, watches: 1, lastWatchedAt: now };

        return [entry, ...prefs].slice(0, MAX_PREFERENCES);
    }

    const updated: PlayerPreferenceEntry = {
        ...prefs[index],
        watches: prefs[index].watches + 1,
        lastWatchedAt: now,
    };

    return [updated, ...prefs.slice(0, index), ...prefs.slice(index + 1)].slice(0, MAX_PREFERENCES);
};
