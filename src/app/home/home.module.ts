import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

import { HomePage } from '@app/home/home.page';
import { HomePageRoutingModule } from '@app/home/home-routing.module';
import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        TranslocoModule,
    ],
    declarations: [HomePage, ImageCardComponent]
})
export class HomePageModule {}
