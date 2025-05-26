import { AnimeCacheType } from '@app/store/cache/types';
import { RecentAnimePages } from '@app/store/settings/types';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { animeToUserAnimeRate } from '@app/modules/home/store/recent-animes/utils/anime-to-user-anime-rate.function';

export function recentAnimesToRates(recent: RecentAnimePages = {}, cachedAnimes: AnimeCacheType = {}): UserAnimeRate[] {
    const userAnimeRates: UserAnimeRate[] = [];

    for (const [animeId, { visited, episode }] of Object.entries(recent)) {
        const animeFromCache = cachedAnimes[animeId]?.anime;

        if (animeFromCache) {
            userAnimeRates.push(animeToUserAnimeRate(animeFromCache, episode, visited));
        }
    }

    return userAnimeRates;
}
