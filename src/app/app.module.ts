import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { IonicRouteStrategy } from '@ionic/angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { CoreModule } from '@app/core/core.module';
import { ShikimoriApiInterceptor } from '@app/shared/interceptors/shikimori-api.interceptor';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        CoreModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: ShikimoriApiInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
