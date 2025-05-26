import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { CachedAnimeInterceptor } from '@app/shared/interceptors/cached-animes.interceptor';
import { CoreModule } from '@app/core/core.module';
import { ShikicinemaApiInterceptor } from '@app/shared/interceptors/shikicinema-api.interceptor';
import { ShikimoriApiInterceptor } from '@app/shared/interceptors/shikimori-api.interceptor';

@NgModule({
    declarations: [AppComponent],
    imports: [
        CoreModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: ShikimoriApiInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ShikicinemaApiInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CachedAnimeInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
