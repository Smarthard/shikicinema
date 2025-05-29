import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AnimeRatesEffects, animeRatesReducer } from '@app/modules/home/store/anime-rates';
import { RecentAnimesEffects, recentAnimesReducer } from '@app/modules/home/store/recent-animes';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';


@NgModule({
    imports: [
        StoreModule.forFeature('animeRates', animeRatesReducer),
        StoreModule.forFeature('recentAnimes', recentAnimesReducer),
        EffectsModule.forFeature([
            AnimeRatesEffects,
            RecentAnimesEffects,
        ]),
    ],
    providers: [
        ShikimoriClient,
    ],
})
export class HomeStateModule {}
