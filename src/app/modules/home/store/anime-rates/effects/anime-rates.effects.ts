import {
    Actions,
    createEffect,
    ofType,
} from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import {
    catchError,
    debounceTime,
    delay,
    exhaustMap,
    map,
    switchMap,
} from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import { SHIKIMORI_USER_RATES_V1_LIMIT as RATES_LIMIT } from '@app/modules/home/store/anime-rates/configs';
import { ShikicinemaV1Client } from '@app/shared/services';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { UserAnimeRate } from '@app/shared/types/shikimori';
import {
    getSortedRatesAction,
    getSortedRatesSuccessAction,
    loadAllUserAnimeRatesAction,
    loadAllUserAnimeRatesFailureAction,
    loadAllUserAnimeRatesSuccessAction,
    loadGenresAction,
    loadGenresFailureAction,
    loadGenresSuccessAction,
    loadStudiosAction,
    loadStudiosFailureAction,
    loadStudiosSuccessAction,
    nextPageAction,
    pageLoadSuccessAction,
} from '@app/modules/home/store/anime-rates/actions';
import { shikimoriRateToShikicinema } from '@app/modules/home/store/anime-rates/utils';
import { splitArrayToChunks } from '@app/shared/utils/split-array-to-chunks.funtion';

@Injectable()
export class AnimeRatesEffects {
    private readonly actions$ = inject(Actions);
    private readonly shikimori = inject(ShikimoriClient);
    private readonly shikicinema = inject(ShikicinemaV1Client);

    loadAllUserAnimeRates$ = createEffect(() => this.actions$.pipe(
        ofType(loadAllUserAnimeRatesAction),
        map(({ userId }) => nextPageAction({ userId, page: 1 })),
        catchError((errors) => of(loadAllUserAnimeRatesFailureAction({ errors }))),
    ));

    loadNextPageAnimeRates$ = createEffect(() => this.actions$.pipe(
        ofType(nextPageAction),
        exhaustMap(({ userId, page }) =>
            this.shikimori.getUserAnimeRates(userId, { page, censored: false, limit: RATES_LIMIT }).pipe(
                map((rates) => pageLoadSuccessAction({ userId, page, rates })),
                catchError((errors) => of(loadAllUserAnimeRatesFailureAction({ errors }))),
            ),
        ),
    ));

    pageLoadSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(pageLoadSuccessAction),
        delay(500),
        map(
            ({ userId, rates, page }) => rates?.length < RATES_LIMIT
                ? loadAllUserAnimeRatesSuccessAction()
                : nextPageAction({ userId, page: page + 1 }),
        ),
    ));

    loadSortedRates$ = createEffect(() => this.actions$.pipe(
        ofType(getSortedRatesAction),
        switchMap(({ rates, filters }) => {
            const userRates = rates.map(shikimoriRateToShikicinema);
            const chunks = splitArrayToChunks(userRates, 1000);

            return forkJoin(chunks.map((chunk) => this.shikicinema.filterAnimes(chunk, filters))).pipe(
                map((results) => {
                    const sortedIds = results.flat().map((a) => a.id);
                    const rateMap = new Map(rates.map((rate) => [rate.anime.id, rate]));

                    return getSortedRatesSuccessAction({
                        rates: sortedIds
                            .map((id) => rateMap.get(id))
                            .filter(Boolean) as UserAnimeRate[],
                    });
                }),
            );
        }),
    ));

    loadGenresEffect$ = createEffect(() => this.actions$.pipe(
        ofType(loadGenresAction),
        switchMap(() => this.shikicinema.getGenres().pipe(
            map((genres) => loadGenresSuccessAction({ genres })),
            catchError((error) => of(loadGenresFailureAction({ error }))),
        )),
    ));

    loadStudiosEffect$ = createEffect(() => this.actions$.pipe(
        ofType(loadStudiosAction),
        debounceTime(500),
        switchMap(({ name }) => this.shikicinema.getStudios(name).pipe(
            map((studios) => loadStudiosSuccessAction({ studios })),
            catchError((error) => of(loadStudiosFailureAction({ error }))),
        )),
    ));
}
