import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { tap } from 'rxjs/operators';

import { updateLanguageAction } from '@app/store/settings/actions/settings.actions';

@Injectable()
export class SettingsEffects {
    private readonly actions$ = inject(Actions);
    private readonly translate = inject(TranslocoService);

    updateSettingsEffect$ = createEffect(() => this.actions$.pipe(
        ofType(updateLanguageAction),
        tap(({ language }) => {
            if (language) {
                this.translate.setActiveLang(language);
            }
        }),
    ), { dispatch: false });
}
