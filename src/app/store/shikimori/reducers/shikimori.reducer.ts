import { createReducer, on } from '@ngrx/store';

import { ShikimoriStoreInterface } from '@app/store/shikimori/types/shikimori-store.interface';
import {
    getCurrentUserAction,
    getCurrentUserFailureAction,
    getCurrentUserSuccessAction,
} from '@app/store/shikimori/actions/get-current-user.action';

const initialState: ShikimoriStoreInterface = {
    isCurrentUserLoading: false,
    currentUser: null,
};

const reducer = createReducer(
    initialState,
    on(
        getCurrentUserAction,
        (state) => ({
            ...state,
            isCurrentUserLoading: true,
        }),
    ),
    on(
        getCurrentUserSuccessAction,
        (state, { currentUser }) => ({
            ...state,
            currentUser,
        }),
    ),
    on(
        getCurrentUserFailureAction,
        (state) => ({
            ...state,
            currentUser: null,
        }),
    ),
    on(
        getCurrentUserSuccessAction,
        getCurrentUserFailureAction,
        (state) => ({
            ...state,
            isCurrentUserLoading: false,
        }),
    )
);

export function shikimoriReducer(state, action) {
    return reducer(state, action);
}
