import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import {
    catchError,
    exhaustMap,
    map,
    switchMap,
} from 'rxjs/operators';
import { from, of } from 'rxjs';

import { AuthEffects } from '@app/store/auth/effects/auth.effects';
import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import {
    authShikimoriAction,
    authShikimoriFailureAction,
    authShikimoriSuccessAction,
} from '@app/store/auth/actions/auth.actions';

@Injectable()
export class AuthNativeAppEffects extends AuthEffects {
    override oauthShikimori$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriAction),
        exhaustMap(() => from(this.electronIpc.getShikimoriAuthCode())),
        switchMap((code) => this.shikimoriClient.getNewToken(code)),
        map((credentials) => authShikimoriSuccessAction({ credentials })),
        catchError((errors) => of(authShikimoriFailureAction({ errors }))),
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
