import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { animeRatesReducer } from '@app/home/store/anime-rates/reducers/anime-rates.reducer';
import { AnimeRatesEffects } from '@app/home/store/anime-rates/effects/anime-rates.effects';


@NgModule({
    imports: [
        StoreModule.forFeature('animeRates', animeRatesReducer),
        EffectsModule.forFeature([
            AnimeRatesEffects,
        ]),
    ],
    providers: [
        ShikimoriClient,
    ]
})
export class HomeStateModule {}
