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
    '[Genres] Load genres success',
    props<{ genres: ShikicinemaGenre[] }>(),
);

export const loadGenresFailureAction = createAction(
    '[Genres] Load genres failure',
    props<{ error: any }>(),
);

export const loadStudiosAction = createAction(
    '[Genres] Load studios',
    props<{ name?: string }>(),
);

export const loadStudiosSuccessAction = createAction(
    '[Genres] Load studios success',
    props<{ studios: ShikicinemaStudio[] }>(),
);

export const loadStudiosFailureAction = createAction(
    '[Genres] Load studios failure',
    props<{ error: any }>(),
);

export const toggleAnimeFiltersAction = createAction('[Genres] Toggle anime filters');

