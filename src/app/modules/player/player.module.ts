import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';

import { FilterByEpisodePipe } from '@app/shared/pipes/filter-by-episode/filter-by-episode.pipe';
import { FilterByKindPipe } from '@app/shared/pipes/filter-by-kind/filter-by-kind.pipe';
import { GetActiveKindsPipe } from '@app/shared/pipes/get-active-kinds/get-active-kinds.pipe';
import { KindSelectorComponent } from '@app/modules/player/components/kind-selector/kind-selector.component';
import { PlayerComponent } from '@app/modules/player/components/player/player.component';
import { PlayerPage } from '@app/modules/player/player.page';
import { PlayerRoutingModule } from '@app/modules/player/player-routing.module';
import { PlayerStateModule } from '@app/modules/player/store/player-state.module';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';
import { VideoSelectorComponent } from '@app/modules/player/components/video-selector/video-selector.component';


@NgModule({
    declarations: [PlayerPage],
    imports: [
        CommonModule,
        PlayerRoutingModule,
        IonicModule,
        PlayerStateModule,
        PlayerComponent,
        VideoSelectorComponent,
        FilterByEpisodePipe,
        KindSelectorComponent,
        SkeletonBlockModule,
        GetActiveKindsPipe,
        FilterByKindPipe,
    ],
})
export class PlayerModule {}
