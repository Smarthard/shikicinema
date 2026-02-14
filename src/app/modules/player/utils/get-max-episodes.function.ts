import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';

export function getMaxEpisode(anime: AnimeBriefInfoInterface, uploadedMaxEpisode = -1): number {
    const animeMaxEp = anime?.episodes || anime?.episodes_aired || 0;

    return uploadedMaxEpisode > animeMaxEp
        ? uploadedMaxEpisode
        : animeMaxEp;
}
