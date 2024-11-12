import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgLetModule } from 'ng-let';
import { NgModule } from '@angular/core';

import { CommentsComponent } from '@app/modules/player/components/comments/comments.component';
import { ControlPanelComponent } from '@app/modules/player/components/control-panel/control-panel.component';
import { FilterByEpisodePipe } from '@app/shared/pipes/filter-by-episode/filter-by-episode.pipe';
import { FilterByKindPipe } from '@app/shared/pipes/filter-by-kind/filter-by-kind.pipe';
import { GetActiveKindsPipe } from '@app/shared/pipes/get-active-kinds/get-active-kinds.pipe';
import { GetEpisodesPipe } from '@app/shared/pipes/get-episodes/get-episodes.pipe';
import { KindSelectorComponent } from '@app/modules/player/components/kind-selector/kind-selector.component';
import { PlayerComponent } from '@app/modules/player/components/player/player.component';
import { PlayerPage } from '@app/modules/player/player.page';
import { PlayerRoutingModule } from '@app/modules/player/player-routing.module';
import { PlayerStateModule } from '@app/modules/player/store/player-state.module';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';
import { SwipeDirective } from '@app/shared/directives/swipe.directive';
import { ToUploaderPipe } from '@app/modules/player/pipes/to-uploader.pipe';
import { UploaderComponent } from '@app/modules/player/components/uploader/uploader.component';
import { VideoSelectorComponent } from '@app/modules/player/components/video-selector/video-selector.component';
import { WELL_KNOWN_UPLOADERS_MAP } from '@app/shared/config/well-known-uploaders.config';
import { WELL_KNOWN_UPLOADERS_TOKEN } from '@app/shared/types/well-known-uploaders.token';


@NgModule({
    declarations: [PlayerPage],
    providers: [
        { provide: WELL_KNOWN_UPLOADERS_TOKEN, useValue: WELL_KNOWN_UPLOADERS_MAP },
    ],
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
        GetEpisodesPipe,
        ControlPanelComponent,
        UploaderComponent,
        ToUploaderPipe,
        SwipeDirective,
        NgLetModule,
        CommentsComponent,
    ],
})
export class PlayerModule {}
