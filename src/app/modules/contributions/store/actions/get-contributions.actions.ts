import { createAction, props } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types/resource-id.type';

export const getContributionsAction = createAction(
    '[Contributions] get contributions',
    props<{ uploaderId: ResourceIdType }>(),
);

export const getContributionsSuccessAction = createAction(
    '[Contributions] get contributions success',
    props<{ contributions: any }>(),
);

export const getContributionsFailureAction = createAction(
    '[Contributions] get contributions failure',
    props<{ errors: unknown }>(),
);

