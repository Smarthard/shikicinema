import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { AnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export function getAnimeName(anime: AnimeBriefInfoInterface | AnimeRate, language: string): string {
    switch (language) {
        case 'ru':
            return anime.russian || anime.name;
        case 'original':
            return anime?.japanese?.[0] || anime.name;
        case 'en':
        default:
            return anime?.english?.[0] || anime.name;
    }
}
