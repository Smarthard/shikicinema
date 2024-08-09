import { createAction, props } from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { ApiErrorInfo } from '@app/shared/types/shikimori/api-error-info.interface';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
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

export const watchAnimeAction = createAction(
    '[Player] watch anime',
    props<{
        animeId: number,
        episode: number,
        isRewarch?: boolean
    }>(),
);

export const watchAnimeSuccessAction = createAction(
    '[Player] watch anime success',
    props<{ userRate: UserAnimeRate }>(),
);

export const watchAnimeFailureAction = createAction(
    '[Player] watch anime failure',
    props<{ errors: ApiErrorInfo }>(),
);

export const watchFoundAnimeAction = createAction(
    '[Player] watch found anime',
);
