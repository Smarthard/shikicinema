import { createReducer, on } from '@ngrx/store';

import AuthStoreInterface, { ShikimoriCredentials } from '@app/store/auth/types/auth-store.interface';
import {
    authShikimoriRefreshSuccessAction,
    authShikimoriSuccessAction,
    changeShikimoriCredentialsAction,
    logoutShikimoriAction,
} from '@app/store/auth/actions/auth.actions';

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
        authShikimoriRefreshSuccessAction,
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
