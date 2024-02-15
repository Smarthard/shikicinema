import { createAction, props } from '@ngrx/store';

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
