import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';

export function getMaxEpisode(anime: AnimeBriefInfoInterface): number {
    return anime?.episodes || anime?.episodes_aired || 0;
}
