import { createAction, props } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types/resource-id.type';

export const getUploaderAction = createAction(
    '[Contributions] get uploader',
    props<{ uploaderName: string }>(),
);

export const getUploaderSuccessAction = createAction(
    '[Contributions] get uploader success',
    props<{ uploaderId: ResourceIdType }>(),
);

export const getUploaderFailureAction = createAction(
    '[Contributions] get uploader failure',
    props<{ errors: unknown }>(),
);

