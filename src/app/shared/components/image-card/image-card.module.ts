import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipsModule } from 'ionic4-tooltips';

import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';
import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';


@NgModule({
    imports: [
        CommonModule,
        SkeletonBlockModule,
        TooltipsModule,
    ],
    declarations: [
        ImageCardComponent,
    ],
    exports: [
        ImageCardComponent,
    ],
})
export class ImageCardModule {}
