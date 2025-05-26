import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    EMPTY,
    catchError,
    exhaustMap,
    map,
    take,
} from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { animeCacheEntitiesToCache, filterByTtl } from '@app/store/cache/utils';
import { cacheHealthCheckUpAction, cacheHealthCheckUpSuccessAction } from '@app/store/cache/actions';
import { selectCachedAnimes } from '@app/store/cache/selectors/cache.selectors';

@Injectable()
export class CacheEffects {
    cacheHealthCheckUp$ = createEffect(() => this.actions$.pipe(
        ofType(cacheHealthCheckUpAction),
        exhaustMap(() => this.store.select(selectCachedAnimes).pipe(
            take(1),
            map((cached) => {
                const filtered = filterByTtl(Object.values(cached || {}));
                const newCache = animeCacheEntitiesToCache(filtered);

                return cacheHealthCheckUpSuccessAction({ animes: newCache });
            }),
            catchError(() => EMPTY),
        )),
    ));

    constructor(
        private actions$: Actions,
        private store: Store,
    ) {}
}
