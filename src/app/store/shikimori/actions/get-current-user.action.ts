import { createAction, props } from '@ngrx/store';

import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';

export const getCurrentUserAction = createAction('[Shikimori API] get current user');

export const getCurrentUserSuccessAction = createAction(
    '[Shikimori API] get current user success',
    props<{ currentUser: UserBriefInfoInterface }>(),
);

export const getCurrentUserFailureAction = createAction(
    '[Shikimori API] get current user failure',
    props<{ errors: unknown }>(),
);
