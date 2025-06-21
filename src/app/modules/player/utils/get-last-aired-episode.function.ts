import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';

export function getLastAiredEpisode(anime: AnimeBriefInfoInterface): number {
    return anime?.status === 'released'
        ? anime?.episodes || 0
        : anime?.episodes_aired || anime?.episodes || 0;
}
