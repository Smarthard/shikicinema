import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import {
    findAnimeAction,
    findAnimeFailureAction,
    findAnimeSuccessAction,
} from '@app/store/shikimori/actions/find-anime.action';
import {
    getCurrentUserAction,
    getCurrentUserFailureAction,
    getCurrentUserSuccessAction,
} from '@app/store/shikimori/actions/get-current-user.action';

@Injectable()
export class ShikimoriEffects {
    getCurrentUserEffect$ = createEffect(() => this.actions$.pipe(
        ofType(getCurrentUserAction),
        switchMap(() => this.shikimoriClient.getCurrentUser().pipe(
            map((currentUser) => getCurrentUserSuccessAction({ currentUser })),
            catchError((err) => of(getCurrentUserFailureAction(err))),
        )),
    ));

    findAnimeEffect$ = createEffect(() => this.actions$.pipe(
        ofType(findAnimeAction),
        switchMap(({ searchStr }) => this.shikimoriClient.findAnimes({ search: searchStr, limit: 16 }).pipe(
            map((animes) => findAnimeSuccessAction({ animes })),
            catchError((errors) => of(findAnimeFailureAction({ errors }))),
        )),
    ));

    constructor(
        private actions$: Actions,
        private shikimoriClient: ShikimoriClient,
    ) {}
}
