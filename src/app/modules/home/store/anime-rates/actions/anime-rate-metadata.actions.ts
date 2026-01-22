import { createAction, props } from '@ngrx/store';

import { AnimeRatesMetadataGQL } from '@app/shared/types/shikimori/graphql';
import { ExtendedUserRateStatusType } from '@app/modules/home/types';
import { ResourceIdType } from '@app/shared/types';

export const initLoadingMetadataAction = createAction(
    '[Anime Rates] init loading metadata',
    props<{ status: ExtendedUserRateStatusType, count: number }>(),
);

export const getAnimeRatesMetadataAction = createAction(
    '[Anime Rates] get anime rates metadata',
    props<{ animeIds: ResourceIdType[] }>(),
);

export const getAnimeRatesMetadataSuccessAction = createAction(
    '[Anime Rates] get anime rates metadata success',
    props<{ metadata: AnimeRatesMetadataGQL[] }>(),
);

export const getAnimeRatesMetadataFailureAction = createAction(
    '[Anime Rates] get anime rates metadata failure',
    props<{ errors: any }>(),
);


