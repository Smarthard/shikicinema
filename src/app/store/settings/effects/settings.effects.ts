import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { tap } from 'rxjs/operators';

import { updateSettingsAction } from '@app/store/settings/actions/settings.actions';

@Injectable()
export class SettingsEffects {
    updateSettingsEffect$ = createEffect(() => this.actions$.pipe(
        ofType(updateSettingsAction),
        tap(({ config }) => {
            const { language } = config;

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
