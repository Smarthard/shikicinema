import { createAction, props } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

export const loadAnimeRateByStatusAction = createAction(
    '[Anime Rates] load anime rate by status',
    props<{ status: UserRateStatusType; userId: ResourceIdType }>(),
);

export const loadAnimeRateByStatusSuccessAction = createAction(
    '[Anime Rates] load anime rate by status success',
    props<{ status: UserRateStatusType; userId: ResourceIdType; rates: UserAnimeRate[]; newRates: UserAnimeRate[] }>(),
);

export const loadAnimeRateByStatusFailureAction = createAction(
    '[Anime Rates] load anime rate by status failure',
    props<{ status: UserRateStatusType; errors: unknown }>(),
);

