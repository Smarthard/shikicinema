import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { NgxVisibilityModule } from 'ngx-visibility';
import { TranslocoModule } from '@ngneat/transloco';

import { CardGridComponent } from '@app/modules/home/components/card-grid/card-grid.component';
import { CardGridItemComponent } from '@app/modules/home/components/card-grid-item/card-grid-item.component';
import { HomePage } from '@app/modules/home/home.page';
import { HomePageRoutingModule } from '@app/modules/home/home-routing.module';
import { HomeStateModule } from '@app/modules/home/store/home-state.module';
import { ImageCardModule } from '@app/shared/components/image-card/image-card.module';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';
import { TypedTemplateDirective } from '@app/shared/directives/typed-template.directive';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        TranslocoModule,
        LayoutModule,
        NgxVisibilityModule,
        NgxTippyModule,
        HomeStateModule,
        SkeletonBlockModule,
        ImageCardModule,
    ],
    declarations: [
        HomePage,
        CardGridComponent,
        CardGridItemComponent,
        TypedTemplateDirective,
    ],
})
export class HomePageModule {}
