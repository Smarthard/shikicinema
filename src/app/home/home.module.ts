import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { LayoutModule } from '@angular/cdk/layout';
import { NgxVisibilityModule } from 'ngx-visibility';
import { TooltipsModule } from 'ionic4-tooltips';

import { HomePage } from '@app/home/home.page';
import { HomePageRoutingModule } from '@app/home/home-routing.module';
import { CardGridComponent } from '@app/home/components/card-grid/card-grid.component';
import { TypedTemplateDirective } from '@app/shared/directives/typed-template.directive';
import { HomeStateModule } from '@app/home/store/home-state.module';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';
import { ImageCardModule } from '@app/shared/components/image-card/image-card.module';
import { CardGridItemComponent } from '@app/home/components/card-grid-item/card-grid-item.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        TranslocoModule,
        LayoutModule,
        NgxVisibilityModule,
        TooltipsModule,
        HomeStateModule,
        SkeletonBlockModule,
        ImageCardModule,
    ],
    declarations: [
        HomePage,
        CardGridComponent,
        CardGridItemComponent,
        TypedTemplateDirective,
    ]
})
export class HomePageModule {}
