import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AnimeRatesEffects } from '@app/modules/home/store/anime-rates/effects/anime-rates.effects';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { animeRatesReducer } from '@app/modules/home/store/anime-rates/reducers/anime-rates.reducer';


@NgModule({
    imports: [
        StoreModule.forFeature('animeRates', animeRatesReducer),
        EffectsModule.forFeature([
            AnimeRatesEffects,
        ]),
    ],
    providers: [
        ShikimoriClient,
    ],
})
export class HomeStateModule {}
