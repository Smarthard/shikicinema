import {NgModule} from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgxResponsiveEmbedModule} from 'ngx-responsive-embed';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PlayerComponent} from './routes/player/player.component';
import {VideoPlayerComponent} from './shared/components/video-player/video-player.component';
import {SafeVideoUrlPipe} from './shared/pipes/safe-video-url-pipe/safe-video-url.pipe';
import {ShikivideosService} from './services/shikivideos-api/shikivideos.service';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {VideoListComponent} from './shared/components/video-list/video-list.component';
import {EpisodesListComponent} from './shared/components/episodes-list/episodes-list.component';
import {KindRemoteComponent} from './shared/components/kind-remote/kind-remote.component';
import {UploaderComponent} from './shared/components/uploader/uploader.component';
import {ServerStatusComponent} from './shared/components/server-status/server-status.component';
import {DropdownFiltersComponent} from './shared/components/dropdown-filters/dropdown-filters.component';
import {NgPipesModule} from 'ngx-pipes';
import {ShikimoriService} from './services/shikimori-api/shikimori.service';
import {UploadVideoComponent} from './shared/components/upload-video/upload-video.component';
import {HttpRequestsInterceptor} from './shared/interceptors/requests.interceptor';
import {NotifyComponent} from './shared/components/notify/notify.component';
import {NitificationComponent} from './shared/components/nitification/nitification.component';
import {SettingsComponent} from './routes/settings/settings.component';
import {CompactVideoListComponent} from './shared/components/compact-video-list/compact-video-list.component';
import {VideosComponent} from './routes/videos/videos.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatMenuModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {ControlBoxComponent} from './shared/components/control-box/control-box.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';

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
    DropdownFiltersComponent,
    UploadVideoComponent,
    NotifyComponent,
    NitificationComponent,
    SettingsComponent,
    CompactVideoListComponent,
    VideosComponent,
    ControlBoxComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    NgxResponsiveEmbedModule,
    CommonModule,
    FormsModule,
    NgPipesModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSortModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestsInterceptor, multi: true },
    ShikivideosService,
    ShikimoriService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
