import { createReducer, on } from '@ngrx/store';

import ContributionsStoreInterface from '@app/modules/contributions/store/types/contributions-store.interface';
import {
    getContributionsFailureAction,
    getContributionsSuccessAction,
} from '@app/modules/contributions/store/actions/get-contributions.actions';
import {
    getUploaderAction,
    getUploaderSuccessAction,
} from '@app/modules/contributions/store/actions/get-uploader.actions';

const initialState: ContributionsStoreInterface = {
    uploaderName: null,
    uploaderId: null,
    contributions: [],
    errors: null,
};

const reducer = createReducer(
    initialState,
    on(
        getUploaderAction,
        (state, { uploaderName }) => ({
            ...state,
            uploaderName,
        }),
    ),
    on(
        getUploaderSuccessAction,
        (state, { uploaderId }) => ({
            ...state,
            uploaderId,
        }),
    ),
    on(
        getContributionsSuccessAction,
        (state, { contributions }) => ({
            ...state,
            contributions,
        }),
    ),
    on(
        getContributionsFailureAction,
        (state, { errors }) => ({
            ...state,
            errors,
        }),
    ),
);

export function contibutionsReducer(state, action) {
    return reducer(state, action);
}
