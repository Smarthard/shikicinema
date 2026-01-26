import { createAction, props } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types';
import { UserAnimeRate } from '@app/shared/types/shikimori';

export const loadAllUserAnimeRatesAction = createAction(
    '[Anime Rates] load all user anime rates',
    props<{ userId: ResourceIdType }>(),
);

export const loadAllUserAnimeRatesSuccessAction = createAction(
    '[Anime Rates] load all user anime rates success',
);

export const loadAllUserAnimeRatesFailureAction = createAction(
    '[Anime Rates] load all user anime rates failure',
    props<{ errors: unknown }>(),
);

export const nextPageAction = createAction(
    '[Anime Rates] load next page for user anime rates',
    props<{ userId: ResourceIdType, page: number }>(),
);

export const pageLoadSuccessAction = createAction(
    '[Anime Rates] page load success',
    props<{
        userId: ResourceIdType,
        page: number,
        rates: UserAnimeRate[],
    }>(),
);

