import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export type AnimeCacheType = {
    [animeId in ResourceIdType]: AnimeBriefInfoInterface;
};
