import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    catchError,
    exhaustMap,
    switchMap,
    map,
} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { ToastController } from '@ionic/angular';

import { AuthEffects } from '@app/store/auth/effects/auth.effects';
import {
    authShikimoriAction,
    authShikimoriFailureAction,
    authShikimoriSuccessAction
} from '@app/store/auth/actions/auth.actions';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';

@Injectable()
export class AuthNativeAppEffects extends AuthEffects {

    override oauthShikimori$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriAction),
        exhaustMap(() => from(this.electronIpc.getShikimoriAuthCode())),
        switchMap((code) => this.shikimoriClient.getNewToken(code)),
        map((credentials) => authShikimoriSuccessAction({ credentials })),
        catchError((errors) => of(authShikimoriFailureAction({ errors })))
    ));

    constructor(
        store: Store,
        actions$: Actions,
        shikimoriClient: ShikimoriClient,
        translate: TranslocoService,
        toast: ToastController,
        private electronIpc: ElectronIpcProxyService,
    ) {
        super(
            store,
            actions$,
            shikimoriClient,
            translate,
            toast,
        );
    }
}
