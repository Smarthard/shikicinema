import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        SkeletonBlockComponent,
    ],
    exports: [
        SkeletonBlockComponent,
    ],
})
export class SkeletonBlockModule {}
