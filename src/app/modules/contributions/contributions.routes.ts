import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { ContributionsEffects } from '@app/modules/contributions/store/effects/contributions.effects';
import { ContributionsPage } from '@app/modules/contributions/contributions.page';
import { contibutionsReducer } from '@app/modules/contributions/store/reducers/contibutions.reducer';

export const CONTRIBUTIONS_ROUTES: Routes = [
    {
        path: '',
        component: ContributionsPage,
        providers: [
            provideState({ name: 'contributions', reducer: contibutionsReducer }),
            provideEffects(
                ContributionsEffects,
            ),
        ],
    },
];
