import { AnimeRatesMetadataGQL } from '@app/shared/types/shikimori/graphql';
import { getAnimeRateName } from '@app/modules/home/utils/get-anime-rate-name.function';

export function sortRatesByAnimeName(
    rateA: AnimeRatesMetadataGQL,
    rateB: AnimeRatesMetadataGQL,
    language: string,
    isCaseSensitive = false,
): number {
    const nameA = getAnimeRateName(rateA, language);
    const nameB = getAnimeRateName(rateB, language);
    const locales = language === 'en' ? ['en', 'jp'] : ['en', language];
    const options: Intl.CollatorOptions = {
        sensitivity: isCaseSensitive ? 'case' : 'base',
    };

    if (!nameA || !nameB) return 0;

    return nameA.localeCompare(nameB, locales, options);
}
