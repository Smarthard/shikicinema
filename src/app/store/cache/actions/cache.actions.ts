import { createAction, props } from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { CacheStoreInterface } from '@app/store/cache/types';
import { UploaderIdType } from '@app/shared/types/uploader-id.type';
import { UploaderInterface } from '@app/modules/player/types';

type CacheStoreKeyType = keyof CacheStoreInterface;


export const updateCacheAction = createAction(
    '[Cache] Update',
    props<{ key: keyof CacheStoreInterface, value: CacheStoreInterface[CacheStoreKeyType] }>(),
);

export const updateUploadersCacheAction = createAction(
    '[Cache] Update uploaders',
    props<{ uploaderId: UploaderIdType, uploader: UploaderInterface }>(),
);

export const updateAnimesCacheAction = createAction(
    '[Cache] Update animes',
    props<{ anime: AnimeBriefInfoInterface }>(),
);

export const resetCacheAction = createAction(
    '[Cache] Reset',
);
