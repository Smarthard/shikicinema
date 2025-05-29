import {
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    iif,
    mergeMap,
    of,
    take,
    tap,
} from 'rxjs';

import { getUserRateAction } from '@app/modules/player/store/actions';
import { selectCachedAnimeById } from '@app/store/cache';

@Injectable()
export class CachedAnimeInterceptor implements HttpInterceptor {
    constructor(
        private store: Store,
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler) {
        if (/\/\/shikimori.*?\/api\/animes\/\d+$/.test(request?.url)) {
            const [animeId = -1] = request?.url?.match(/\d+/);

            return this.store.select(selectCachedAnimeById(animeId)).pipe(
                take(1),
                tap((cached) => {
                    if (cached) {
                        const { user_rate: userRate = null } = cached;

                        console.groupCollapsed(`[Cache] Hit for anime id ${animeId}`);
                        console.log('Result:', cached);
                        console.groupEnd();

                        if (userRate?.id) {
                            this.store.dispatch(getUserRateAction({ id: userRate.id, animeId }));
                        }
                    }
                }),
                mergeMap((anime) => iif(
                    () => Boolean(anime?.id),
                    of(new HttpResponse({ body: anime })),
                    next.handle(request),
                )),
            );
        }

        return next.handle(request);
    }
}

