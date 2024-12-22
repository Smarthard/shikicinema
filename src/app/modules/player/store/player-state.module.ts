import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { PlayerEffects } from '@app/modules/player/store/effects/player.effects';
import { ShikicinemaV1Client } from '@app-root/app/shared/services/shikicinema-v1.client';
import { ShikimoriClient } from '@app/shared/services';
import { metaReducers, reducers } from '@app/modules/player/store/reducers/player-state.reducer';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature('player', reducers, { metaReducers }),
        EffectsModule.forFeature([
            PlayerEffects,
        ]),
    ],
    providers: [
        ShikicinemaV1Client,
        ShikimoriClient,
    ],
})
export class PlayerStateModule {}
