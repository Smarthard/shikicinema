import {LOCALE_ID, NgModule} from '@angular/core';
import localeRu from '@angular/common/locales/ru';
import {CommonModule, HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgxResponsiveEmbedModule} from 'ngx-responsive-embed';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PlayerComponent} from './routes/player/player.component';
import {VideoPlayerComponent} from './shared/components/video-player/video-player.component';
import {SafeVideoUrlPipe} from './shared/pipes/safe-video-url-pipe/safe-video-url.pipe';
import {ShikivideosService} from './services/shikivideos-api/shikivideos.service';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {VideoListComponent} from './shared/components/video-list/video-list.component';
import {EpisodesListComponent} from './shared/components/episodes-list/episodes-list.component';
import {FranchiseListComponent} from './shared/components/franchise-list/franchise-list.component';
import {KindRemoteComponent} from './shared/components/kind-remote/kind-remote.component';
import {UploaderComponent} from './shared/components/uploader/uploader.component';
import {DropdownFiltersComponent} from './shared/components/dropdown-filters/dropdown-filters.component';
import {NgPipesModule} from 'ngx-pipes';
import {ShikimoriService} from './services/shikimori-api/shikimori.service';
import {UploadVideoComponent} from './shared/components/upload-video/upload-video.component';
import {NotifyComponent} from './shared/components/notify/notify.component';
import {NotificationComponent} from './shared/components/notification/notification.component';
import {SettingsComponent} from './routes/settings/settings.component';
import {CompactVideoListComponent} from './shared/components/compact-video-list/compact-video-list.component';
import {VideosComponent} from './routes/videos/videos.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ControlBoxComponent} from './shared/components/control-box/control-box.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ShikivideosRequestsInterceptor} from './shared/interceptors/shikivideos-requests.interceptor';
import {ShikimoriAuthRequestsInterceptor} from './shared/interceptors/shikimori-auth-requests.interceptor';
import {AboutDialogComponent} from './shared/components/about-dialog/about-dialog.component';
import {RequestDialogComponent} from './shared/components/request-dialog/request-dialog.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {VirtualScrollEpisodeListComponent} from './shared/components/virtual-scroll-episode-list/virtual-scroll-episode-list.component';
import {ButtonScrollEpisodeListComponent} from './shared/components/button-scroll-episode-list/button-scroll-episode-list.component';
import {OldfagEpisodesListSkeletonComponent} from './shared/components/skeletons/oldfag-episodes-list-skeleton/oldfag-episodes-list-skeleton.component';
import {NgxSkeletonLoaderModule} from '@exalif/ngx-skeleton-loader';
import {HeaderComponent} from './shared/components/header/header.component';
import {MatBadgeModule} from '@angular/material/badge';
import {NotificationsBadgeComponent} from './shared/components/notifications-badge/notifications-badge.component';
import {MatDividerModule} from '@angular/material/divider';
import {RemoteNotificationsService} from './services/remote-notifications/remote-notifications.service';
import {CommentsComponent} from './shared/components/comments/comments.component';
import {BubbleViewComponent} from './shared/components/bubble-view/bubble-view.component';
import {SafeHtmlPipe} from './shared/pipes/safe-html-pipe/safe-html.pipe';
import {CommentFormComponent} from './shared/components/comment-form/comment-form.component';
import {SmilleyComponent} from './shared/components/smilley/smilley.component';
import {CommentComponent} from './shared/components/comment/comment.component';
import {CommentBadgeComponent} from './shared/components/comment-badge/comment-badge.component';
import {InlineSVGModule} from 'ng-inline-svg';
import {ShikimoriApiThrottleInterceptor} from './shared/interceptors/shikimori-api-throttle.interceptor';

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    VideoPlayerComponent,
    SafeVideoUrlPipe,
    VideoListComponent,
    EpisodesListComponent,
    FranchiseListComponent,
    KindRemoteComponent,
    UploaderComponent,
    DropdownFiltersComponent,
    UploadVideoComponent,
    NotifyComponent,
    NotificationComponent,
    SettingsComponent,
    CompactVideoListComponent,
    VideosComponent,
    ControlBoxComponent,
    AboutDialogComponent,
    RequestDialogComponent,
    VirtualScrollEpisodeListComponent,
    ButtonScrollEpisodeListComponent,
    OldfagEpisodesListSkeletonComponent,
    HeaderComponent,
    NotificationsBadgeComponent,
    CommentsComponent,
    BubbleViewComponent,
    SafeHtmlPipe,
    CommentFormComponent,
    SmilleyComponent,
    CommentComponent,
    CommentBadgeComponent
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
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    NgxSkeletonLoaderModule,
    MatBadgeModule,
    MatDividerModule,
    ReactiveFormsModule,
    InlineSVGModule.forRoot({ baseUrl: chrome.runtime.getURL('/') }),
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: ShikimoriApiThrottleInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ShikivideosRequestsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ShikimoriAuthRequestsInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'ru' },
    ShikivideosService,
    ShikimoriService,
    RemoteNotificationsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [AboutDialogComponent, RequestDialogComponent]
})
export class AppModule { }
