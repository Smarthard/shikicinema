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
import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { CardGridComponent } from '@app/home/components/card-grid/card-grid.component';
import { TypedTemplateDirective } from '@app/shared/directives/typed-template.directive';
import { HomeStateModule } from '@app/home/store/home-state.module';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';


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
    ],
    declarations: [
        HomePage,
        ImageCardComponent,
        CardGridComponent,
        TypedTemplateDirective,
    ]
})
export class HomePageModule {}
