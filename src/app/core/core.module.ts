import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideScrollbarPolyfill } from 'ngx-scrollbar';

import { AppStateModule } from '@app/store/app-state.module';
import { Base64Module } from '@app/shared/pipes/base64/base64.module';
import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';
import { GoExternalPage } from '@app/core/pages/go-external/go-external.page';
import { HeaderComponent } from '@app/core/components/header/header.component';
import { ImageCardModule } from '@app/shared/components/image-card/image-card.module';
import { PLATFORM_API_TOKEN, platformApiFactory } from '@app/shared/services/platform-api/platform-api.factory';
import { SearchbarResultsComponent } from '@app/core/components/searchbar-results/searchbar-results.component';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { ShikimoriMediaNameModule } from '@app/shared/pipes/shikimori-media-name/shikimori-media-name.module';
import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';
import { TranslocoRootModule } from '@app/core/transloco-root.module';

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
        provideScrollbarPolyfill('assets/scroll-timeline-polyfill.js'),
        { provide: PLATFORM_API_TOKEN, useFactory: platformApiFactory, deps: [ElectronIpcProxyService] },
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
