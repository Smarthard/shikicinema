import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export interface AnimeNameSortingConfig {
    caseSensitive: boolean;
    compareOriginalName: boolean;
}

export function sortByAnimeName(
    rateA: UserAnimeRate,
    rateB: UserAnimeRate,
    { compareOriginalName, caseSensitive }: AnimeNameSortingConfig
) {
    const nameA = compareOriginalName ? rateA.anime.name : rateA.anime.russian;
    const nameB = compareOriginalName ? rateB.anime.name : rateB.anime.russian;
    const locales: string[] = compareOriginalName ? ['en', 'jp'] : ['en', 'ru'];
    const options: Intl.CollatorOptions = {
        sensitivity: caseSensitive ? 'case' : 'base',
    };

    return nameA.localeCompare(nameB, locales, options);
}

export function sortByAnimeUserRating(
    rateA: UserAnimeRate,
    rateB: UserAnimeRate,
    config: AnimeNameSortingConfig
) {
    const cmp = +rateB.score - +rateA.score;

    return cmp === 0
        ? sortByAnimeName(rateA, rateB, config)
        : cmp;
}
