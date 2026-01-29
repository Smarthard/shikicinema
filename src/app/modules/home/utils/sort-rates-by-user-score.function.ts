import { UserAnimeRate } from '@app/shared/types/shikimori';
import { sortRatesByAnimeName } from '@app/modules/home/utils/sort-rates-by-anime-name.function';


export function sortRatesByUserScore(
    rateA: UserAnimeRate,
    rateB: UserAnimeRate,
    language: string,
    isCaseSensitive = false,
    isAsc = true,
): number {
    const scoreA = rateA?.score || 0;
    const scoreB = rateB?.score || 0;
    const compare = isAsc
        ? scoreB - scoreA
        : scoreA - scoreB;

    return compare === 0
        ? sortRatesByAnimeName(rateA, rateB, language, isCaseSensitive)
        : compare;
}
