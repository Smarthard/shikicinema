import { Injectable, inject } from '@angular/core';
import {
    catchError,
    exhaustMap,
    map,
    switchMap,
} from 'rxjs/operators';
import { concatLatestFrom } from '@ngrx/operators';
import { createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';

import { AuthEffects } from '@app/store/auth/effects/auth.effects';
import { SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
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

    readonly shikimoriDomain$ = inject(SHIKIMORI_DOMAIN_TOKEN);

    override oauthShikimori$ = createEffect(() => this.actions$.pipe(
        ofType(authShikimoriAction),
        concatLatestFrom(() => this.shikimoriDomain$),
        exhaustMap(([_, shikimoriDomain]) => from(getAuthorizationCode(shikimoriDomain, this.shikimoriClientId)).pipe(
            switchMap((code) => this.shikimoriClient.getNewToken(code)),
            map((credentials) => authShikimoriSuccessAction({ credentials })),
            catchError((errors) => of(authShikimoriFailureAction({ errors }))),
        )),
    ));
}
