import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import {
    catchError,
    exhaustMap,
    map,
    switchMap,
} from 'rxjs/operators';
import { from, of } from 'rxjs';

import { AuthEffects } from '@app/store/auth/effects/auth.effects';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import {
    authShikimoriAction,
    authShikimoriFailureAction,
    authShikimoriSuccessAction,
} from '@app/store/auth/actions/auth.actions';
import { environment } from '@app-env/environment';
import { getAuthorizationCode } from '@app/shared/utils/shikimori-api.web-extension.utils';

@Injectable()
export class AuthWebExtensionEffects extends AuthEffects {
    override oauthShikimori$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriAction),
        exhaustMap(() => from(getAuthorizationCode(environment.shikimori.authClientId))),
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
