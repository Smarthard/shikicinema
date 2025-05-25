import { AnimeCacheType } from '@app/shared/types/anime-cache.type';
import { WellKnownType } from '@app/shared/types/well-known-uploaders.type';

export interface CacheStoreInterface {
    knownUploaders: WellKnownType;
    animes: AnimeCacheType;
}
