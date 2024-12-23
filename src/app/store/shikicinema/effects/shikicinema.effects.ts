import {
    Actions,
    createEffect,
    ofType,
} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    catchError,
    map,
    switchMap,
    tap,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { ShikicinemaV1Client } from '@app/shared/services';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import {
    getUploadTokenAction,
    getUploadTokenFailureAction,
    getUploadTokenSuccessAction,
} from '@app/store/shikicinema/actions/get-upload-token.action';
import {
    uploadVideoAction,
    uploadVideoFailureAction,
    uploadVideoSuccessAction,
} from '@app/store/shikicinema/actions/upload-video.action';

@Injectable()
export class ShikicinemaEffects {
    getUploadToken$ = createEffect(() => this._actions$.pipe(
        ofType(getUploadTokenAction),
        switchMap(({ shikimoriToken }) => this._shikicinemaV1.getUploadToken(shikimoriToken?.shikimoriBearerToken).pipe(
            map((uploadToken) => getUploadTokenSuccessAction({ uploadToken })),
            catchError((errors) => of(getUploadTokenFailureAction({ errors }))),
        )),
    ));

    uploadVideo$ = createEffect(() => this._actions$.pipe(
        ofType(uploadVideoAction),
        switchMap(({ video, animeId }) => this._shikicinemaV1.uploadVideo(animeId, video).pipe(
            map((video) => uploadVideoSuccessAction({ video })),
            catchError((errors) => of(uploadVideoFailureAction({ errors }))),
        )),
    ));

    getUploadTokenFailure$ = createEffect(() => this._actions$.pipe(
        ofType(getUploadTokenFailureAction),
        tap(async () => {
            const toast = await this._toast.create({
                id: 'shikicinema-get-upload-token-failure',
                color: 'danger',
                message: this._transloco.translate('GLOBAL.AUTH.SHIKICINEMA.UPLOAD_TOKEN.FAILURE'),
                duration: 5000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    uploadVideoFailure$ = createEffect(() => this._actions$.pipe(
        ofType(uploadVideoFailureAction),
        tap(async ({ errors }) => {
            const message = `PLAYER_MODULE.PLAYER_PAGE.UPLOAD_VIDEO.STATUSES.ERROR_CODES.${errors?.status || 500}`;
            const toast = await this._toast.create({
                id: 'shikicinema-upload-video-failure',
                color: 'danger',
                header: this._transloco.translate('PLAYER_MODULE.PLAYER_PAGE.UPLOAD_VIDEO.STATUSES.FAILURE'),
                message: this._transloco.translate(message),
                duration: 5000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    constructor(
        private _actions$: Actions,
        private _store: Store,
        private _shikicinemaV1: ShikicinemaV1Client,
        private _transloco: TranslocoService,
        private _toast: ToastController,
    ) {}
}
