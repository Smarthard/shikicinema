import { UserAnimeRate } from '@app/shared/types/shikimori';

export function getAnimeRateName(rate: UserAnimeRate, language: string): string {
    const defaultName = rate?.anime?.name;

    switch (language) {
        case 'ru':
            return rate?.anime?.russian || defaultName;
        case 'jp':
            return rate?.anime?.japanese || defaultName;
        case 'en':
            return rate?.anime?.english || defaultName;
        default:
            return defaultName;
    }
}
