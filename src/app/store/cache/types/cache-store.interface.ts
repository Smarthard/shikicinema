import { AnimeCacheType } from '@app/store/cache/types';
import { VideoUploadFormInterface } from '@app/modules/player/types';
import { WellKnownType } from '@app/shared/types/well-known-uploaders.type';

export interface CacheStoreInterface {
    knownUploaders: WellKnownType;
    animes: AnimeCacheType;
    videoUploadForm: VideoUploadFormInterface;
    lastCheckUp: string;
}
