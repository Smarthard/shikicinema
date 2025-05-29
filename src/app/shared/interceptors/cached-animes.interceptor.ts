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
    tap,
} from 'rxjs';

import { selectCachedAnimeById } from '@app/store/cache/selectors/cache.selectors';

@Injectable()
export class CachedAnimeInterceptor implements HttpInterceptor {
    constructor(
        private store: Store,
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler) {
        if (/\/\/shikimori.*?\/api\/animes\/\d+$/.test(request?.url)) {
            const [animeId = -1] = request?.url?.match(/\d+/);

            return this.store.select(selectCachedAnimeById(animeId)).pipe(
                tap((cached) => {
                    if (cached) {
                        console.groupCollapsed(`[Cache] Hit for anime id ${animeId}`);
                        console.log('Result:', cached);
                        console.groupEnd();
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

