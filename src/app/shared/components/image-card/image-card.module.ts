import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';


@NgModule({
    imports: [
        CommonModule,
        SkeletonBlockModule,
    ],
    declarations: [
        ImageCardComponent,
    ],
    exports: [
        ImageCardComponent,
    ],
})
export class ImageCardModule {}
