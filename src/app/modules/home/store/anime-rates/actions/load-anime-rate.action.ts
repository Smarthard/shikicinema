import { createAction, props } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types';
import { UserBriefRateInterface } from '@app/shared/types/shikimori';

export const loadAllUserAnimeRatesAction = createAction(
    '[Anime Rates] load all user anime rates',
    props<{ userId: ResourceIdType }>(),
);

export const loadAllUserAnimeRatesSuccessAction = createAction(
    '[Anime Rates] load all user anime rates success',
    props<{
        userId: ResourceIdType;
        rates: UserBriefRateInterface[];
    }>(),
);

export const loadAllUserAnimeRatesFailureAction = createAction(
    '[Anime Rates] load all user anime rates failure',
    props<{ errors: unknown }>(),
);

