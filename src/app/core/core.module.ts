import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RouterModule } from '@angular/router';
import { TooltipsModule } from 'ionic4-tooltips';

import { TranslocoRootModule } from '@app/transloco-root.module';
import { AppStateModule } from '@app/store/app-state.module';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { HeaderComponent } from '@app/core/components/header/header.component';
import { GoExternalPage } from '@app/core/pages/go-external/go-external.page';
import { PLATFORM_API_TOKEN, platformApiFactory } from '@app/shared/services/platform-api/platform-api.factory';
import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';
import { SearchbarResultsComponent } from '@app/core/components/searchbar-results/searchbar-results.component';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';
import { ShikimoriMediaNameModule } from '@app/shared/pipes/shikimori-media-name/shikimori-media-name.module';
import { Base64Module } from '@app/shared/pipes/base64/base64.module';
import { ImageCardModule } from '@app/shared/components/image-card/image-card.module';

const components = [
    HeaderComponent,
    SearchbarResultsComponent,
    GoExternalPage,
];

@NgModule({
    declarations: [
        ...components,
    ],
    providers: [
        ShikimoriClient,
        { provide: PLATFORM_API_TOKEN, useFactory: platformApiFactory, deps: [ ElectronIpcProxyService ] }
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
        TooltipsModule,
        SkeletonBlockModule,
        ShikimoriMediaNameModule,
        Base64Module,
        ImageCardModule,
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
