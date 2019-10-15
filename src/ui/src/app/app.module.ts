import {NgModule} from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {NgxResponsiveEmbedModule} from "ngx-responsive-embed";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PlayerComponent} from './routes/player/player.component';
import {VideoPlayerComponent} from './shared/components/video-player/video-player.component';
import {SafeVideoUrlPipe} from './shared/pipes/safe-video-url-pipe/safe-video-url.pipe';
import {ShikivideosService} from "./services/shikivideos-api/shikivideos.service";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {VideoListComponent} from './shared/components/video-list/video-list.component';
import {EpisodesListComponent} from './shared/components/episodes-list/episodes-list.component';
import { KindRemoteComponent } from './shared/components/kind-remote/kind-remote.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    VideoPlayerComponent,
    SafeVideoUrlPipe,
    VideoListComponent,
    EpisodesListComponent,
    KindRemoteComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    NgxResponsiveEmbedModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ShikivideosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
