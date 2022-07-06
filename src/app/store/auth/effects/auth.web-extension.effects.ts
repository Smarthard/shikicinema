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

import { environment } from '@app-env/environment';
import { AuthEffects } from '@app/store/auth/effects/auth.effects';
import {
    authShikimoriAction,
    authShikimoriFailureAction,
    authShikimoriSuccessAction
} from '@app/store/auth/actions/auth.actions';
import { getAuthorizationCode } from '@app/shared/utils/shikimori-api.web-extension.utils';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';

@Injectable()
export class AuthWebExtensionEffects extends AuthEffects {

    override oauthShikimori$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriAction),
        exhaustMap(() => from(getAuthorizationCode(environment.shikimori.authClientId))),
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
