import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { TranslocoRootModule } from '@app/transloco-root.module';
import { AppStateModule } from '@app/store/app-state.module';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';


@NgModule({
    declarations: [],
    providers: [
        ShikimoriClient,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        CommonModule,
        HttpClientModule,
        TranslocoRootModule,
        AppStateModule,
    ],
    exports: [
        BrowserModule,
        IonicModule,
        IonicStorageModule,
        CommonModule,
        HttpClientModule,
        TranslocoRootModule,
    ],
})
export class CoreModule {}
