import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

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
