import {
    Actions,
    CreateEffectMetadata,
    createEffect,
    ofType,
} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import {
    catchError,
    delay,
    map,
    switchMap,
    tap,
} from 'rxjs/operators';
import { concatLatestFrom } from '@ngrx/operators';
import { of } from 'rxjs';

import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import {
    authShikimoriFailureAction,
    authShikimoriRefreshAction,
    authShikimoriRefreshFailureAction,
    authShikimoriRefreshSuccessAction,
    authShikimoriSuccessAction,
    logoutShikimoriAction,
} from '@app/store/auth/actions/auth.actions';
import { getCurrentUserAction } from '@app/store/shikimori/actions/get-current-user.action';
import { selectShikimoriCurrentUser } from '@app/store/shikimori/selectors/shikimori.selectors';

@Injectable()
export class AuthEffects {
    protected declare oauthShikimori$: CreateEffectMetadata;

    protected finalizeShikimoriAuth$ = createEffect(() => this.actions$.pipe(
        ofType(
            authShikimoriSuccessAction,
            authShikimoriFailureAction,
            logoutShikimoriAction,
        ),
        map(() => getCurrentUserAction()),
    ));

    protected oauthShikimoriRefresh$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriRefreshAction),
        switchMap(({ refreshToken }) => this.shikimoriClient.refreshToken(refreshToken).pipe(
            map((credentials) => authShikimoriRefreshSuccessAction({ credentials })),
            catchError((errors) => of(authShikimoriRefreshFailureAction({ errors }))),
        )),
    ));

    protected oauthShikimoriRefreshFailure$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriRefreshFailureAction),
        tap(async () => {
            const toast = await this.toast.create({
                id: 'shikimori-auth-refresh-failure',
                color: 'danger',
                message: this.translate.translate('GLOBAL.AUTH.SHIKIMORI.REFRESH.FAILURE'),
                duration: 1000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    protected oauthShikimoriSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriSuccessAction),
        delay(1000),
        concatLatestFrom(() => this.store.select(selectShikimoriCurrentUser)),
        tap(async ([, user]) => {
            const toast = await this.toast.create({
                id: 'shikimori-auth-success',
                color: 'success',
                message: this.translate.translate('GLOBAL.AUTH.SHIKIMORI.LOGIN.SUCCESS', { nickname: user.nickname }),
                duration: 1000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    protected oauthShikimoriFailure$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriFailureAction),
        tap(async () => {
            const toast = await this.toast.create({
                id: 'shikimori-auth-failure',
                color: 'warning',
                message: this.translate.translate('GLOBAL.AUTH.SHIKIMORI.LOGIN.FAILURE'),
                duration: 1000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    constructor(
        protected store: Store,
        protected actions$: Actions,
        protected shikimoriClient: ShikimoriClient,
        protected translate: TranslocoService,
        protected toast: ToastController,
    ) {}
}
