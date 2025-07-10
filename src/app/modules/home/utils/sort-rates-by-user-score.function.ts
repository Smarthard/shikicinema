import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates';
import { UserBriefRateInterface } from '@app/shared/types/shikimori';
import { sortRatesByAnimeName } from '@app/modules/home/utils/sort-rates-by-anime-name.function';


export function sortRatesByUserScore(
    a: UserBriefRateInterface,
    b: UserBriefRateInterface,
    ratesMetadata: AnimeRatesMetadata,
    language: string,
    isCaseSensitive = false,
    isAsc = true,
): number {
    const rateA = ratesMetadata?.[a?.target_id];
    const rateB = ratesMetadata?.[b?.target_id];
    const scoreA = a?.score || 0;
    const scoreB = b?.score || 0;
    const compare = isAsc
        ? scoreB - scoreA
        : scoreA - scoreB;

    return compare === 0
        ? sortRatesByAnimeName(rateA, rateB, language, isCaseSensitive)
        : compare;
}
