import { AnimeCacheType } from '@app/store/cache/types';
import { WellKnownType } from '@app/shared/types/well-known-uploaders.type';

export interface CacheStoreInterface {
    knownUploaders: WellKnownType;
    animes: AnimeCacheType;
    lastCheckUp: string;
}
