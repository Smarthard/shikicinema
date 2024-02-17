import { createAction, props } from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { VideoInfoInterface } from '@app/modules/player/types';

export const addVideosAction = createAction(
    '[Player] Add videos',
    props<{ animeId: string, videos: VideoInfoInterface[] }>(),
);

export const findVideosAction = createAction(
    '[Player] Find videos',
    props<{ animeId: string }>(),
);

export const findVideosSuccessAction = createAction(
    '[Player] Find success videos',
);

export const findVideosFailureAction = createAction(
    '[Player] Find failure videos',
);

export const getAnimeInfoAction = createAction(
    '[Player] Get anime info',
    props<{ animeId: string }>(),
);

export const getAnimeInfoSuccessAction = createAction(
    '[Player] Get anime info success',
    props<{ anime: AnimeBriefInfoInterface }>(),
);

export const getAnimeInfoFailureAction = createAction(
    '[Player] Get anime info failure',
);
