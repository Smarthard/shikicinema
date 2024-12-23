import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import {
    catchError,
    exhaustMap,
    map,
    switchMap,
} from 'rxjs/operators';
import { concatLatestFrom } from '@ngrx/operators';

import { AuthEffects } from '@app/store/auth/effects/auth.effects';
import { SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
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
    readonly shikimoriClientId = environment.shikimori.authClientId;

    override oauthShikimori$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriAction),
        concatLatestFrom(() => this.shikimoriDomain$),
        exhaustMap(([_, shikimoriDomain]) => from(getAuthorizationCode(shikimoriDomain, this.shikimoriClientId))),
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
        @Inject(SHIKIMORI_DOMAIN_TOKEN)
        private shikimoriDomain$: Observable<string>,
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
