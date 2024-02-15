import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';

import { PlayerComponent } from '@app/modules/player/components/player/player.component';
import { PlayerPage } from '@app/modules/player/player.page';
import { PlayerRoutingModule } from '@app/modules/player/player-routing.module';
import { PlayerStateModule } from '@app/modules/player/store/player-state.module';


@NgModule({
    declarations: [PlayerPage],
    imports: [
        CommonModule,
        PlayerRoutingModule,
        IonicModule,
        PlayerStateModule,
        PlayerComponent,
    ],
})
export class PlayerModule {}
