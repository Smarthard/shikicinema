import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
