import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { AnimeRatesEffects, animeRatesReducer } from '@app/modules/home/store/anime-rates';
import { HomePage } from '@app/modules/home/home.page';
import { RecentAnimesEffects, recentAnimesReducer } from '@app/modules/home/store/recent-animes';
import { ShikimoriClient } from '@app/shared/services';

export const HOME_ROUTES: Routes = [
    {
        path: '',
        component: HomePage,
        providers: [
            ShikimoriClient,
            provideState({ name: 'animeRates', reducer: animeRatesReducer }),
            provideState({ name: 'recentAnimes', reducer: recentAnimesReducer }),
            provideEffects(
                AnimeRatesEffects,
                RecentAnimesEffects,
            ),
        ],
    },
];
