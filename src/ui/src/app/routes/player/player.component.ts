import {Component, OnDestroy, OnInit} from '@angular/core';
import {AboutDialogComponent} from '../../shared/components/about-dialog/about-dialog.component';
import {ShikivideosService} from '../../services/shikivideos-api/shikivideos.service';
import {ShikimoriService} from '../../services/shikimori-api/shikimori.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Shikimori} from '../../types/shikimori';
import {HttpHeaders} from '@angular/common/http';
import {SmarthardNet} from '../../types/smarthard-net';
import {AuthService} from '../../services/auth/auth.service';
import {NotificationsService} from '../../services/notifications/notifications.service';
import {ShikicinemaSettings} from '../../types/ShikicinemaSettings';
import {SettingsService} from '../../services/settings/settings.service';
import {UserPreferencesService} from '../../services/user-preferences/user-preferences.service';
import {catchError, distinctUntilChanged, map, publishReplay, refCount, switchMap, takeWhile, tap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, EMPTY, of, Subject} from 'rxjs';
import {Notification, NotificationType} from '../../types/notification';
import {MatDialog} from '@angular/material/dialog';
import {IRequestDialogData, RequestDialogComponent} from '../../shared/components/request-dialog/request-dialog.component';
import {KodikService} from '../../services/kodik-api/kodik.service';
import {RemoteNotificationsService} from '../../services/remote-notifications/remote-notifications.service';
import {CommentsService} from '../../services/comments/comments.service';
import {VideosService} from '../../services/videos/videos.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {

  private isAlive = true;

  public readonly EMPTY_VIDEO = new SmarthardNet.Shikivideo({ id: -666 });
  public filter = new SmarthardNet.VideoFilter();
  public isUploadOpened = false;
  public settings: ShikicinemaSettings;
  public urlParams: { animeId?: number, episode?: number } = {};
  public userRate: Shikimori.UserRate;

  readonly episodeSubject = new BehaviorSubject<number>(1);
  readonly quotesSubject = new Subject<string>();
  readonly repliesSubject = new Subject<string>();

  readonly animeId$ = this.route.params.pipe(
    map((params) => params?.animeId as number),
    distinctUntilChanged()
  );

  readonly anime$ = this.animeId$
    .pipe(
      tap((animeId: number) => this.videosService.setAnimeId(animeId)),
      switchMap(() => this.videosService.anime$)
    );

  readonly episode$ = this.episodeSubject.pipe(
    switchMap(episode => episode !== 1
      ? of(episode)
      : this.route.params
        .pipe(
          map(params => (params.episode as number) || 1)
        )
    ),
    tap((episode: number) => this.videosService.setEpisode(episode))
  );

  readonly quotes$ = this.quotesSubject.asObservable();
  readonly replies$ = this.repliesSubject.asObservable();

  readonly whoami$ = this.shikimori.whoAmI(new HttpHeaders()
    .set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma', 'no-cache')
  ).pipe(
    publishReplay(1),
    refCount()
  );

  readonly userRate$ = this.videosService.anime$.pipe(
    map((anime) => anime.user_rate),
    catchError(() => of(null)),
    publishReplay(1),
    refCount()
  );

  readonly uploader$ = this.videosService.uploader$;

  readonly notifications$ = this.remoteNotifications.notifications$;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private notify: NotificationsService,
    private remoteNotifications: RemoteNotificationsService,
    private preferenses: UserPreferencesService,
    private videosApi: ShikivideosService,
    private kodikService: KodikService,
    private shikimori: ShikimoriService,
    private settingsService: SettingsService,
    readonly commentsService: CommentsService,
    readonly videosService: VideosService,
    private title: Title,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  ngOnInit() {
    this.settingsService.get()
      .subscribe(
      data => this.settings = new ShikicinemaSettings(data)
    );

    this.route.params
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe(
      params => this.urlParams = {
        animeId: params['animeId'],
        episode: params['episode']
      }
    );

    this.episode$
      .pipe(
        takeWhile(() => this.isAlive),
        (episode$) => combineLatest([episode$, this.anime$])
      )
      .subscribe(([episode, anime]) => {
        const title = anime.russian || anime.name;
        this.commentsService.setAnime(anime);
        this.commentsService.setEpisode(episode);
        this.title.setTitle(`${title} - эпизод ${episode}`)
        this.EMPTY_VIDEO.episode = episode;
      });

    this.videosService.videos$
      .pipe(
        takeWhile(() => this.isAlive),
      )
      .subscribe(
        (videos) => {
        const query = this.route.snapshot.queryParams;
        const videoById = videos.filter((vid) => vid.id === (query?.id as number))[0];
        const favVideos = this._chooseFavourite(videos);

        this.changeVideo( videos.length === 0 ? this.EMPTY_VIDEO : (videoById ? videoById : favVideos[0]) );
      }
    );

    this.userRate$
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe(
        userRates => this.userRate = new Shikimori.UserRate(userRates ? userRates : {})
    );
  }

  async changeEpisode(episode: number | string) {
    if (episode !== '' && !isNaN(episode as number)) {
      this.episodeSubject.next(+episode);
      await this.router.navigate([`../${episode}`], { relativeTo:  this.route });
    }
  }

  addQuote(quote: string) {
    this.quotesSubject.next(quote);
  }

  addReply(reply: string) {
    this.repliesSubject.next(reply);
  }

  changeVideo(video: SmarthardNet.Shikivideo) {
    this.videosService.currentVideo = video;
  }

  async synchronize() {
    const token = await this.auth.shikimoriSync().toPromise();

    if (token) {
      setTimeout(() => window.location.reload(), 700);
    }
  }

  watched(episode: number): boolean {
    return this.userRate && this.userRate.episodes >= episode;
  }

  async watch(anime: Shikimori.Anime, episode: number, user: Shikimori.User, message: string) {
    const animeEpisodes = anime.episodes || anime.episodes_aired;
    const userRate = new Shikimori.UserRate({
      user_id: user.id,
      target_id: anime.id,
      target_type: 'Anime',
      episodes: episode
    });

    if (this.userRate.id) {
      userRate.id = this.userRate.id;
      this.userRate = await this.shikimori.setUserRates(userRate).toPromise();
    } else {
      this.userRate = await this.shikimori.createUserRates(userRate).toPromise();
    }

    if (animeEpisodes >= episode + 1) {
      await this.changeEpisode(episode + 1);
    }

    this.notify.add(new Notification(NotificationType.OK, message));
  }

  openUploadForm() {
    this.isUploadOpened = true;
  }

  closeUploadForm() {
    this.isUploadOpened = false;
  }

  openAboutDialog() {
    this.dialog.open(AboutDialogComponent);
  }

  async openRequestsDialog() {
    const user = await this.whoami$.toPromise();
    const data: IRequestDialogData = {
      video: this.videosService.currentVideo,
      requester: `https://shikimori.one/${user.nickname}`
    };
    const requestDialogRef = this.dialog.open(RequestDialogComponent, { minWidth: '50%', disableClose: true, data });

    requestDialogRef
      .afterClosed()
      .pipe(
        switchMap((request: SmarthardNet.IRequest) => request ? this.videosApi.createRequest(request) : EMPTY)
      )
      .subscribe(
        () => this.notify.add(new Notification(NotificationType.OK, 'Запрос успешно отправлен!')),
        () => this.notify.add(new Notification(NotificationType.ERROR, 'Не удалось отправить'))
      )
  }

  nextCommentsPage() {
    this.commentsService.nextPage();
  }

  private _chooseFavourite(videos: SmarthardNet.Shikivideo[]): SmarthardNet.Shikivideo[] {
    if (videos.length === 0) {
      return videos;
    }

    const preferences = this.preferenses.get(+videos[0].anime_id);
    const byAuthor = videos.filter(value => value.author === preferences.author);
    const byPlayer = byAuthor.filter(value => value.getSecondLvlDomain() === preferences.player);
    const byQuality = byPlayer.filter(value => value.quality === preferences.quality);

    if (byQuality.length > 0) {
      return byQuality;
    } else if (byPlayer.length > 0) {
      return byPlayer;
    } else if (byAuthor.length > 0) {
      return byAuthor;
    } else {
      return videos;
    }
  }
}
