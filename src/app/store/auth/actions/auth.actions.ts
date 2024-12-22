import { createAction, props } from '@ngrx/store';

import { ShikimoriCredentials } from '@app/store/auth/types/auth-store.interface';


export const authShikimoriAction = createAction(
    '[Auth] OAuth2 shikimori',
);

export const authShikimoriSuccessAction = createAction(
    '[Auth] OAuth2 shikimori success',
    props<{ credentials: ShikimoriCredentials }>(),
);

export const authShikimoriFailureAction = createAction(
    '[Auth] OAuth2 shikimori failure',
    props<{ errors: unknown }>(),
);

export const changeShikimoriCredentialsAction = createAction(
    '[Auth] OAuth2 shikimori credentials change',
    props<{ credentials: ShikimoriCredentials }>(),
);

export const logoutShikimoriAction = createAction(
    '[Auth] OAuth2 shikimori logout',
);
