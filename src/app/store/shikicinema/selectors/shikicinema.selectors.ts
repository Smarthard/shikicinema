import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ShikicinemaStoreInterface } from '@app/store/shikicinema/types/shikicinema-store.interface';

export const selectShikicinema = createFeatureSelector<ShikicinemaStoreInterface>('shikicinema');

export const selectShikicinemaUploadToken = createSelector(
    selectShikicinema,
    (state) => state.uploadToken,
);

export const selectShikicinemaTokenProcessing = createSelector(
    selectShikicinema,
    (state) => state.isProcessing,
);

