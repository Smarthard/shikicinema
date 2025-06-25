import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export function sortRatesByDateVisited(userRates: UserAnimeRate[]): UserAnimeRate[] {
    return userRates.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
}
