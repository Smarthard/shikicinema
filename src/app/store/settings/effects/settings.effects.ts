import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { filter, map, tap } from 'rxjs/operators';

import {
    addVisitedAnimePageAction,
    updateLanguageAction,
    visitedPageAction,
} from '@app/store/settings/actions/settings.actions';

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

    visitedPageEffect$ = createEffect(() => this.actions$.pipe(
        ofType(visitedPageAction),
        filter(({ url }) => url.startsWith('/player')),
        map(({ url }) => url.match(/(\d)+/)),
        map(([animeId, episode]) => addVisitedAnimePageAction({ animeId, episode })),
    ));

    constructor(
        private actions$: Actions,
        private translate: TranslocoService,
    ) {}
}
