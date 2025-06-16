import {
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    first,
    firstValueFrom,
    iif,
    mergeMap,
    of,
    take,
    tap,
} from 'rxjs';

import { getUserRateAction } from '@app/modules/player/store/actions';
import { selectCachedAnimeById } from '@app/store/cache';
import { selectShikimoriCurrentUser } from '@app/store/shikimori/selectors/shikimori.selectors';

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
                tap(async (cached) => {
                    const currentUser = await firstValueFrom(this.store.select(selectShikimoriCurrentUser)
                        .pipe(first((user) => !!user?.id)),
                    );

                    if (cached) {
                        console.groupCollapsed(`[Cache] Hit for anime id ${animeId}`);
                        console.log('Result:', cached);
                        console.groupEnd();

                        this.store.dispatch(getUserRateAction({ userId: currentUser.id, animeId }));
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

