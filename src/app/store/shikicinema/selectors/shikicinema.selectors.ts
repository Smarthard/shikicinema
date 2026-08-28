import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ShikicinemaStoreInterface } from '@app/store/shikicinema/types/shikicinema-store.interface';
import { UploadToken } from '@app/shared/types/shikicinema/v1';

export const selectShikicinema = createFeatureSelector<ShikicinemaStoreInterface>('shikicinema');

export const selectShikicinemaUploadToken = createSelector(
    selectShikicinema,
    ({ uploadToken }) => uploadToken ?? {} as UploadToken,
);

export const selectShikicinemaTokenProcessing = createSelector(
    selectShikicinema,
    (state) => state.isProcessing,
);

