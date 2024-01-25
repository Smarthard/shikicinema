import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { AbstractImageCardComponent } from '@app/shared/components/abstract-image-card/abstract-image-card.component';
import { CardGridItemComponent } from '@app/modules/home/components/card-grid-item/card-grid-item.component';
import { ImageCardModule } from '@app/shared/components/image-card/image-card.module';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';

@NgModule({
    declarations: [CardGridItemComponent],
    exports: [CardGridItemComponent],
    imports: [
        CommonModule,
        NgxTippyModule,
        TranslocoModule,
        SkeletonBlockModule,
        RouterModule,
        ImageCardModule,
        AbstractImageCardComponent,
    ],
})
export class CardGridItemModule {}
