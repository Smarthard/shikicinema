import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RouterModule } from '@angular/router';

import { TranslocoRootModule } from '@app/transloco-root.module';
import { AppStateModule } from '@app/store/app-state.module';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { HeaderComponent } from '@app/core/components/header/header.component';
import { B64encodePipe } from '@app/shared/pipes/b64encode.pipe';
import { B64decodePipe } from '@app/shared/pipes/b64decode.pipe';
import { GoExternalPage } from '@app/core/pages/go-external/go-external.page';

const components = [
    HeaderComponent,
    GoExternalPage,
    B64encodePipe,
    B64decodePipe,
];

@NgModule({
    declarations: [
        ...components,
    ],
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
        RouterModule,
    ],
    exports: [
        BrowserModule,
        IonicModule,
        IonicStorageModule,
        CommonModule,
        HttpClientModule,
        TranslocoRootModule,
        ...components,
    ],
})
export class CoreModule {}
