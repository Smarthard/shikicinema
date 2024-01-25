import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardGridComponent } from '@app/modules/home/components/card-grid/card-grid.component';
import { CardGridItemModule } from '@app/modules/home/components/card-grid-item/card-grid-item.module';
import { GetPlayerLinkPipe } from '@app/shared/pipes/get-player-link/get-player-link.pipe';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';

@NgModule({
    declarations: [CardGridComponent],
    exports: [CardGridComponent],
    imports: [
        CommonModule,
        CardGridItemModule,
        SkeletonBlockModule,
        GetPlayerLinkPipe,
    ],
})
export class CardGridModule {}
