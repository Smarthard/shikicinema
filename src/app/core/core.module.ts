import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { TranslocoRootModule } from '@app/transloco-root.module';
import { AppStateModule } from '@app/store/app-state.module';


@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
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
