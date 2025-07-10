import { AnimeRatesMetadataGQL } from '@app/shared/types/shikimori/graphql';
import { sortRatesByAnimeName } from '@app/modules/home/utils/sort-rates-by-anime-name.function';


export function sortRatesByAnimeRating(
    rateA: AnimeRatesMetadataGQL,
    rateB: AnimeRatesMetadataGQL,
    language: string,
    isCaseSensitive = false,
    isAsc = true,
): number {
    const scoreA = rateA?.score;
    const scoreB = rateB?.score;
    const compare = isAsc
        ? scoreB - scoreA
        : scoreA - scoreB;

    if (!scoreA || !scoreB) return 0;

    return compare === 0
        ? sortRatesByAnimeName(rateA, rateB, language, isCaseSensitive)
        : compare;
}
