import { createAction, props } from '@ngrx/store';

import { AnimeQueryFiltersInterface, ShikicinemaGenre, ShikicinemaStudio } from '@app/shared/types/shikicinema/v1';
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

export const getSortedRatesAction = createAction(
    '[Anime Rates] get sorted rates',
    props<{
        rates: UserAnimeRate[],
        filters: AnimeQueryFiltersInterface,
    }>(),
);

export const getSortedRatesSuccessAction = createAction(
    '[Anime Rates] get sorted rates success',
    props<{ rates: UserAnimeRate[] }>(),
);

export const changeAnimeRatesFiltersAction = createAction(
    '[Anime Rates] change filters',
    props<{ filters: AnimeQueryFiltersInterface }>(),
);

export const loadGenresAction = createAction('[Genres] Load genres');

export const loadGenresSuccessAction = createAction(
    '[Anime Rates] Load genres success',
    props<{ genres: ShikicinemaGenre[] }>(),
);

export const loadGenresFailureAction = createAction(
    '[Anime Rates] Load genres failure',
    props<{ error: any }>(),
);

export const loadStudiosAction = createAction(
    '[Anime Rates] Load studios',
    props<{ name?: string }>(),
);

export const loadStudiosSuccessAction = createAction(
    '[Anime Rates] Load studios success',
    props<{ studios: ShikicinemaStudio[] }>(),
);

export const loadStudiosFailureAction = createAction(
    '[Anime Rates] Load studios failure',
    props<{ error: any }>(),
);

export const toggleAnimeFiltersAction = createAction('[Anime Rates] Toggle anime filters');

