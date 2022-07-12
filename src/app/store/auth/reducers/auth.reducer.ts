import { createReducer, on } from '@ngrx/store';

import {
    authShikimoriSuccessAction,
    changeShikimoriCredentialsAction,
    logoutShikimoriAction,
} from '@app/store/auth/actions/auth.actions';
import AuthStoreInterface, { ShikimoriCredentials } from '@app/store/auth/types/auth-store.interface';

const initialShikimoriCredentialsState: ShikimoriCredentials = {
    shikimoriBearerToken: '',
    shikimoriRefreshToken: '',
    accessExpireTimeMs: 0,
    refreshExpireTimeMs: 0,
};

const initialState: AuthStoreInterface = {
    ...initialShikimoriCredentialsState,
};

const reducer = createReducer(
    initialState,
    on(
        authShikimoriSuccessAction,
        changeShikimoriCredentialsAction,
        (state, { credentials }) => ({
            ...state,
            ...credentials,
        }),
    ),
    on(
        logoutShikimoriAction,
        (state) => ({
            ...state,
            ...initialShikimoriCredentialsState,
        }),
    ),
);

export function authReducer(state, action) {
    return reducer(state, action);
}
