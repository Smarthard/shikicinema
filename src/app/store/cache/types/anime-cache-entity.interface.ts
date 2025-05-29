import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';

export interface AnimeCacheEntity {
    anime: AnimeBriefInfoInterface;
    ttl: string;
};
