import { Injectable } from '@angular/core';
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
import {
    authShikimoriAction,
    authShikimoriFailureAction,
    authShikimoriSuccessAction,
} from '@app/store/auth/actions/auth.actions';
import { environment } from '@app-env/environment';
import { getAuthorizationCode } from '@app/shared/utils/shikimori-api.web-extension.utils';
import { selectShikimoriDomain } from '@app/store/shikimori/selectors';


@Injectable()
export class AuthWebExtensionEffects extends AuthEffects {
    readonly shikimoriClientId = environment.shikimori.authClientId;

    readonly shikimoriDomain$ = this.store.select(selectShikimoriDomain);

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
