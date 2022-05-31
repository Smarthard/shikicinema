import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import {
    getCurrentUserAction,
    getCurrentUserFailureAction,
    getCurrentUserSuccessAction
} from '@app/store/shikimori/actions/get-current-user.action';

@Injectable()
export class ShikimoriEffects {

    getCurrentUserEffect$ = createEffect(() => this.actions$.pipe(
        ofType(getCurrentUserAction),
        switchMap(() => this.shikimoriClient.getCurrentUser().pipe(
            map((currentUser) => getCurrentUserSuccessAction({ currentUser })),
            catchError((err) => of(getCurrentUserFailureAction(err)))
        ))
    ));

    constructor(
        private actions$: Actions,
        private shikimoriClient: ShikimoriClient,
    ) {}
}
