import { createAction, props } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { ShikivideosInterface } from '@app/shared/types/shikicinema/v1';
import { VideoInfoInterface } from '@app/modules/player/types';

export const uploadVideoAction = createAction(
    '[Smarthard API] upload video',
    props<{ animeId: ResourceIdType, video: VideoInfoInterface }>(),
);

export const uploadVideoSuccessAction = createAction(
    '[Smarthard API] upload video success',
    props<{ video: ShikivideosInterface }>(),
);

export const uploadVideoFailureAction = createAction(
    '[Smarthard API] upload video failure',
    props<{ errors: any }>(),
);
