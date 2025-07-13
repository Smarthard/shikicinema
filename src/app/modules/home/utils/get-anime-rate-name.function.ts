import { AnimeRatesMetadataGQL } from '@app/shared/types/shikimori/graphql';

export function getAnimeRateName(rateMetadata: AnimeRatesMetadataGQL, language: string): string {
    const defaultName = rateMetadata?.name;

    switch (language) {
        case 'ru':
            return rateMetadata?.russian || defaultName;
        case 'jp':
            return rateMetadata?.japanese || defaultName;
        case 'en':
            return rateMetadata?.english || defaultName;
        default:
            return defaultName;
    }
}
