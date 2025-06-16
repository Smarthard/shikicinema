import { createAction, props } from '@ngrx/store';

export const detectShikimoriDomainAction = createAction(
    '[Shikimori API] Detect shikimori domain',
);

export const detectShikimoriDomainSuccessAction = createAction(
    '[Shikimori API] Detect shikimori domain success',
    props<{ domain: string }>(),
);

export const detectShikimoriDomainFailureAction = createAction(
    '[Shikimori API] Detect shikimori domain failure',
);

export const updateShikimoriDomainAction = createAction(
    '[Shikimori API] Update shikimori domain',
    props<{ domain: string }>(),
);
