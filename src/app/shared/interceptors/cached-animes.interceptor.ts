import { Actions, ofType } from '@ngrx/effects';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import {
    Observable,
    catchError,
    combineLatestWith,
    first,
    iif,
    map,
    mergeMap,
    of,
    switchMap,
    take,
    tap,
    timeout,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';

import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import {
    getUserRateAction,
    getUserRateFailureAction,
    getUserRateSuccessAction,
} from '@app/modules/player/store/actions';
import { selectCachedAnimeById } from '@app/store/cache';
import { selectShikimoriCurrentUser } from '@app/store/shikimori/selectors/shikimori.selectors';

export const cachedAnimeInterceptor: HttpInterceptorFn = (request, next) => {
    const store = inject(Store);
    const actions$ = inject(Actions);

    if (/\/\/shikimori.*?\/api\/animes\/\d+$/.test(request?.url)) {
        const [animeId = -1] = request?.url?.match(/\d+/);

        const animeFromCache$ = store.select(selectCachedAnimeById(animeId));
        const userRate$: Observable<UserAnimeRate> = actions$.pipe(
            ofType(getUserRateSuccessAction, getUserRateFailureAction),
            take(1),
            map((action) => action.type === getUserRateSuccessAction.type
                ? action?.userRate
                : null,
            ),
            timeout(5_000),
            catchError(() => of(null)),
        );

        return store.select(selectShikimoriCurrentUser).pipe(
            first((user) => !!user?.id),
            tap((user) => store.dispatch(getUserRateAction({ userId: user.id, animeId }))),
            switchMap(() => animeFromCache$),
            combineLatestWith(userRate$),
            take(1),
            tap(([cached]) => {
                if (cached) {
                    console.groupCollapsed(`[Cache] Hit for anime id ${animeId}`);
                    console.log('Result:', cached);
                    console.groupEnd();
                }
            }),
            mergeMap(([anime, userRate]) => iif(
                () => Boolean(anime?.id),
                of(new HttpResponse({ body: { ...anime, user_rate: userRate } })),
                next(request),
            )),
        );
    }

    return next(request);
};

