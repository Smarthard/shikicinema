import { createAction, props } from '@ngrx/store';

import { ShikimoriCredentials } from '@app/store/auth/types/auth-store.interface';
import { UploadToken } from '@app/shared/types/shikicinema/v1';

export const getUploadTokenAction = createAction(
    '[Smarthard API] get upload token',
    props<{ shikimoriToken: ShikimoriCredentials }>(),
);

export const getUploadTokenSuccessAction = createAction(
    '[Smarthard API] get upload token success',
    props<{ uploadToken: UploadToken }>(),
);

export const getUploadTokenFailureAction = createAction(
    '[Smarthard API] get upload token failure',
    props<{ errors: unknown }>(),
);
