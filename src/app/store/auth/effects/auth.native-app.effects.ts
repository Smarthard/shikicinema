import { Injectable, inject } from '@angular/core';
import {
    catchError,
    exhaustMap,
    map,
    switchMap,
} from 'rxjs/operators';
import { createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';

import { AuthEffects } from '@app/store/auth/effects/auth.effects';
import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';
import {
    authShikimoriAction,
    authShikimoriFailureAction,
    authShikimoriSuccessAction,
} from '@app/store/auth/actions/auth.actions';

@Injectable()
export class AuthNativeAppEffects extends AuthEffects {
    private electronIpc = inject(ElectronIpcProxyService);

    override oauthShikimori$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriAction),
        exhaustMap(() => from(this.electronIpc.getShikimoriAuthCode())),
        switchMap((code) => this.shikimoriClient.getNewToken(code)),
        map((credentials) => authShikimoriSuccessAction({ credentials })),
        catchError((errors) => of(authShikimoriFailureAction({ errors }))),
    ));
}
