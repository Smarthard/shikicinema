import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { tap } from 'rxjs/operators';

import { updateLanguageAction } from '@app/store/settings/actions/settings.actions';

@Injectable()
export class SettingsEffects {
    updateSettingsEffect$ = createEffect(() => this.actions$.pipe(
        ofType(updateLanguageAction),
        tap(({ language }) => {
            if (language) {
                this.translate.setActiveLang(language);
            }
        }),
    ), { dispatch: false });

    constructor(
        private actions$: Actions,
        private translate: TranslocoService,
    ) {}
}
