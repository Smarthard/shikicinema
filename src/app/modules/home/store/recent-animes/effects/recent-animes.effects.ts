import {
    Actions,
    createEffect,
    ofType,
} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { updateAnimesCacheAction } from '@app/store/cache/actions';
import { visitAnimePageAction } from '@app/modules/home/store/recent-animes/actions/recent-animes.actions';

@Injectable()
export class RecentAnimesEffects {
    visitAnimePageEffect$ = createEffect(() => this.actions$.pipe(
        ofType(visitAnimePageAction),
        map(({ anime }) => updateAnimesCacheAction({ anime })),
    ));

    constructor(
        private actions$: Actions,
    ) {}
}
