import {
    Actions,
    createEffect,
    ofType,
} from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import {
    catchError,
    delay,
    exhaustMap,
    map,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { SHIKIMORI_USER_RATES_V1_LIMIT as RATES_LIMIT } from '@app/modules/home/store/anime-rates/configs';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import {
    loadAllUserAnimeRatesAction,
    loadAllUserAnimeRatesFailureAction,
    loadAllUserAnimeRatesSuccessAction,
    nextPageAction,
    pageLoadSuccessAction,
} from '@app/modules/home/store/anime-rates/actions';

@Injectable()
export class AnimeRatesEffects {
    private readonly actions$ = inject(Actions);
    private readonly shikimori = inject(ShikimoriClient);

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
}
