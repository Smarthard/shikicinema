import { createReducer, on } from '@ngrx/store';

import { ShikicinemaStoreInterface } from '@app/store/shikicinema/types/shikicinema-store.interface';
import {
    getUploadTokenAction,
    getUploadTokenFailureAction,
    getUploadTokenSuccessAction,
} from '@app/store/shikicinema/actions/get-upload-token.action';
import { uploadVideoFailureAction } from '@app/store/shikicinema/actions/upload-video.action';

const initialState: ShikicinemaStoreInterface = {
    isProcessing: false,
    uploadToken: null,
    errors: null,
};

const reducer = createReducer(
    initialState,
    on(
        getUploadTokenAction,
        (state) => ({
            ...state,
            isProcessing: true,
        }),
    ),
    on(
        getUploadTokenSuccessAction,
        (state, action) => ({
            ...state,
            isProcessing: false,
            uploadToken: action.uploadToken,
        }),
    ),
    on(
        getUploadTokenFailureAction,
        uploadVideoFailureAction,
        (state, action) => ({
            ...state,
            errors: action.errors,
        }),
    ),
    on(
        getUploadTokenFailureAction,
        (state) => ({
            ...state,
            isProcessing: false,
        }),
    ),
);

export function shikicinemaReducer(state, action) {
    return reducer(state, action);
}
