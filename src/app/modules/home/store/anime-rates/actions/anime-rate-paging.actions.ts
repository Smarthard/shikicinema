import { createAction, props } from '@ngrx/store';

import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

export const incrementPageForStatusAction = createAction(
    '[Anime Rates] increment page for status',
    props<{ status: UserRateStatusType }>(),
);

export const allPagesLoadedForStatusAction = createAction(
    '[Anime Rates] all rates for status loaded',
    props<{ status: UserRateStatusType; maxItemsLoaded: number }>(),
);

