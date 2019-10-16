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
import {KindRemoteComponent} from './shared/components/kind-remote/kind-remote.component';
import {UploaderComponent} from './shared/components/uploader/uploader.component';
import {ServerStatusComponent} from './shared/components/server-status/server-status.component';
import {DropdownFiltersComponent} from './shared/components/dropdown-filters/dropdown-filters.component';
import {NgPipesModule} from "ngx-pipes";

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    VideoPlayerComponent,
    SafeVideoUrlPipe,
    VideoListComponent,
    EpisodesListComponent,
    KindRemoteComponent,
    UploaderComponent,
    ServerStatusComponent,
    DropdownFiltersComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    NgxResponsiveEmbedModule,
    CommonModule,
    FormsModule,
    NgPipesModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ShikivideosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
