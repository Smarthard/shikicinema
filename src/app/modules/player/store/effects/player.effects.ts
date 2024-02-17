import {
    Actions,
    createEffect,
    ofType,
} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { merge, of, switchMap } from 'rxjs';

import { ShikicinemaV1ClientService, ShikimoriClient } from '@app/shared/services';
import {
    addVideosAction,
    findVideosAction,
    getAnimeInfoAction,
    getAnimeInfoFailureAction,
    getAnimeInfoSuccessAction,
} from '@app/modules/player/store/actions';
import { shikicinemaVideoMapper } from '@app/shared/types/shikicinema/v1';
import { toVideoInfo } from '@app/shared/rxjs';

@Injectable()
export class PlayerEffects {
    findVideos$ = createEffect(() => this.actions$.pipe(
        ofType(findVideosAction),
        switchMap(
            ({ animeId }) => merge(
                this.shikivideos.findAnimes(animeId),
            ).pipe(
                /* accumulating videos into storage */
                toVideoInfo(shikicinemaVideoMapper),
                map((videos) => addVideosAction({ animeId, videos })),
            ),
        ),
    ));

    getAnimeInfo$ = createEffect(() => this.actions$.pipe(
        ofType(getAnimeInfoAction),
        switchMap(({ animeId }) => this.shikimori.getAnimeInfo(animeId)),
        map((anime) => getAnimeInfoSuccessAction({ anime })),
        catchError(() => of(getAnimeInfoFailureAction())),
    ));

    constructor(
        private actions$: Actions,
        private shikivideos: ShikicinemaV1ClientService,
        private shikimori: ShikimoriClient,
    ) {}
}
