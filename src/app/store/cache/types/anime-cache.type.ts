import { AnimeCacheEntity } from '@app/store/cache/types/anime-cache-entity.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export type AnimeCacheType = {
    [animeId in ResourceIdType]: AnimeCacheEntity;
};
