import {
    Actions,
    createEffect,
    ofType,
} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, map, of, switchMap } from 'rxjs';

import { ShikicinemaV1Client, ShikimoriClient } from '@app/shared/services';
import {
    getContributionsAction,
    getContributionsFailureAction,
    getContributionsSuccessAction,
} from '@app/modules/contributions/store/actions/get-contributions.actions';
import {
    getUploaderAction,
    getUploaderFailureAction,
    getUploaderSuccessAction,
} from '@app/modules/contributions/store/actions/get-uploader.actions';

@Injectable()
export class ContributionsEffects {
    getUploaderEffect$ = createEffect(() => this.actions$.pipe(
        ofType(getUploaderAction),
        switchMap(({ uploaderName }) => this.shikimoriClient.getUser(uploaderName)
            .pipe(
                map((user) => getUploaderSuccessAction({ uploaderId: user.id })),
                catchError((errors) => of(getUploaderFailureAction({ errors }))),
            )),
    ));

    getContributionsEffect$ = createEffect(() => this.actions$.pipe(
        ofType(getContributionsAction),
        switchMap(({ uploaderId }) => this.shikicinemaClient.getContributions(uploaderId)
            .pipe(
                map((contributions) => getContributionsSuccessAction({ contributions })),
                catchError((errors) => of(getContributionsFailureAction({ errors }))),
            )),
    ));

    constructor(
        private actions$: Actions,
        private shikicinemaClient: ShikicinemaV1Client,
        private shikimoriClient: ShikimoriClient,
    ) {}
}
