import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';

import { PlayerPage } from '@app/modules/player/player.page';
import { PlayerRoutingModule } from '@app/modules/player/player-routing.module';


@NgModule({
    declarations: [PlayerPage],
    imports: [
        CommonModule,
        PlayerRoutingModule,
        IonicModule,
    ],
})
export class PlayerModule { }
