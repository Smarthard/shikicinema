import { AnimeNameSortingConfig, sortByAnimeUserRating } from '@app/shared/utils/rx-anime-rates-functions';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export function isDuplicateArrayFilter(item: UserAnimeRate, pos: number, array: UserAnimeRate[]) {
    return !pos || item.anime.id !== array[pos - 1].anime.id;
}

export function sortAnimeRatesByUserRating(animeNameSortCfg?: AnimeNameSortingConfig) {
    return (a: UserAnimeRate, b: UserAnimeRate) => sortByAnimeUserRating(a, b, animeNameSortCfg);
}
