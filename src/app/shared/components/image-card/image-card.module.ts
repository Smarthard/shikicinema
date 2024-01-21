import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { IsImageWidthLargerPipe } from '@app/shared/pipes/is-image-width-larger/is-image-width-larger.pipe';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';


@NgModule({
    imports: [
        CommonModule,
        SkeletonBlockModule,
        IsImageWidthLargerPipe,
    ],
    declarations: [
        ImageCardComponent,
    ],
    exports: [
        ImageCardComponent,
    ],
})
export class ImageCardModule {}
