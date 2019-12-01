/// <reference types="@types/chrome" />
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShikivideosService} from '../../services/shikivideos-api/shikivideos.service';
import {ShikimoriService} from '../../services/shikimori-api/shikimori.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Shikimori} from '../../types/shikimori';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {SmarthardNet} from '../../types/smarthard-net';
import {AuthService} from '../../services/auth/auth.service';
import {NotificationsService} from '../../services/notifications/notifications.service';
import {ShikicinemaSettings} from '../../types/ShikicinemaSettings';
import {SettingsService} from '../../services/settings/settings.service';
import {UserPreferencesService} from '../../services/user-preferences/user-preferences.service';
import {catchError, debounceTime, map, publishReplay, refCount, switchMap, takeWhile} from 'rxjs/operators';
import {BehaviorSubject, iif, Observable, of} from 'rxjs';
import {Notification, NotificationType} from '../../types/notification';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {

  private isAlive = true;
  private _httpErrorHandler = (err) => {
    console.error(err);
    this.notify.add(new Notification(NotificationType.ERROR, 'Не удалось загрузить видео!', err));
    return of(<SmarthardNet.Shikivideo[]> []);
  };

  public readonly EMPTY_VIDEO = new SmarthardNet.Shikivideo({ id: -666 });
  public filter = new SmarthardNet.VideoFilter();
  public isUploadOpened: boolean = false;
  public settings: ShikicinemaSettings;
  public urlParams: { animeId?: number, episode?: number } = {};
  public userRate: Shikimori.UserRate;
  public uploader: Shikimori.User;
  public currentVideo: SmarthardNet.Shikivideo;

  readonly episodeSubject = new BehaviorSubject<number>(1);
  readonly uploaderSubject = new BehaviorSubject<string>(null);

  readonly animeId$ = this.route.params.pipe(
    map(params => <number> +params.animeId)
  );

  readonly episode$ = this.episodeSubject.pipe(
    switchMap(episode => {
      return episode !== 1 ? of(episode) : this.route.params.pipe(map(params => <number> params.episode || 1));
    })
  );

  readonly videos$: Observable<SmarthardNet.Shikivideo[]> = this.route.params.pipe(
    switchMap(params => this.videosApi.findById(params.animeId, new HttpParams()
      .set('limit', 'all')
      .set('episode', params.episode ? params.episode : 1)
    )),
    map(videos => videos.map(video => new SmarthardNet.Shikivideo(video))),
    catchError(err => this._httpErrorHandler(err)),
    publishReplay(1),
    refCount()
  );

  readonly maxEpisode$: Observable<{ length: number }> = this.animeId$.pipe(
    switchMap(animeId => this.videosApi.getAnimeMaxLoadedEp(animeId)),
    catchError(() => of({ length: 0 })),
    publishReplay(1),
    refCount()
  );

  readonly whoami$ = this.shikimori.whoAmI(new HttpHeaders()
    .set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma', 'no-cache')
  ).pipe(
    publishReplay(1),
    refCount()
  );

  readonly userRates$ = this.animeId$.pipe(
    switchMap(animeId => {
      return this.whoami$.pipe(
        map(user => { return {user, animeId} })
      );
    }),
    switchMap(query => this.shikimori.getUserRates(
      new HttpParams()
        .set('user_id', `${query.user.id}`)
        .set('target_type', 'Anime')
        .set('target_id', `${query.animeId}`)
    )),
    catchError(() => {
      console.warn('Вы не авторизованы');
      return of(<Shikimori.UserRate[]> [])
    }),
    publishReplay(1),
    refCount()
  );

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private notify: NotificationsService,
    private preferenses: UserPreferencesService,
    private videosApi: ShikivideosService,
    private shikimori: ShikimoriService,
    private settingsService: SettingsService,
    private title: Title
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

    this.videos$
      .pipe(
        takeWhile(() => this.isAlive),
        map(videos => videos.map(v => new SmarthardNet.Shikivideo(v)))
      )
      .subscribe(
        videos => {
        const query = this.route.snapshot.queryParams;
        const videoById = videos.filter(vid => query && query.id && vid.id == query.id)[0];
        const video = videos[0];
        let title = 'Shikicinema';

        title = video ? video.anime_russian || video.anime_english : title;
        this.title.setTitle(video ? `${title} - эпизод ${video.episode}` : title);
        this.changeVideo(videoById ? videoById : this._chooseFavourite(videos)[0] || this.EMPTY_VIDEO);
      }
    );

    this.userRates$
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe(
        userRates => this.userRate = new Shikimori.UserRate(userRates[0] ? userRates[0] : {})
    );

    this.uploaderSubject
      .pipe(
        takeWhile(() => this.isAlive),
        debounceTime(250),
        switchMap(uploader => iif(
          () => !!uploader,
          this.shikimori.getUserInfo(uploader),
          of(null)
        ))
      )
      .subscribe(
      uploader => this.uploader = uploader
    );
  }

  public async changeEpisode(episode: number | string, fromVideo?: SmarthardNet.Shikivideo) {
    if (episode != '') {
      const animeId = this.urlParams.animeId;

      if (fromVideo) {
        const fav = new SmarthardNet.VideoFilter({
          author: fromVideo.author,
          player: fromVideo.getSecondLvlDomain(),
          quality: fromVideo.quality
        });
        this.preferenses.set(+fromVideo.anime_id, fav);
      }

      await this.router.navigate([`/${animeId}/${episode}`]);
    }
  }

  changeVideo(video: SmarthardNet.Shikivideo) {
    this.currentVideo = video;
    this.uploaderSubject.next(video.uploader);
  }

  async synchronize() {
    await this.auth.shikimoriSync();
    setTimeout(() => window.location.reload(), 700);
  }

  watched(episode: number): boolean {
    return this.userRate && this.userRate.episodes >= episode;
  }

  async markAsWatched(video: SmarthardNet.Shikivideo, user: Shikimori.User) {
    if (this.userRate.id) {
      if (this.userRate.episodes < video.episode) {
        const userRate = await this.shikimori.incUserRates(this.userRate).toPromise();
        this.userRate = new Shikimori.UserRate(userRate)
      }
    } else {
      this.userRate = new Shikimori.UserRate({
        user_id: user.id,
        target_id: video.anime_id,
        target_type: 'Anime',
        episodes: video.episode
      });

      await this.shikimori.createUserRates(this.userRate).toPromise();
    }
    this.changeEpisode(+video.episode + 1, video);
    this.notify.add(new Notification(NotificationType.OK, 'Просмотрено'));
  }

  openUploadForm() {
    this.auth.shikivideosSync();
    this.isUploadOpened = !this.isUploadOpened;
  }

  private _chooseFavourite(videos: SmarthardNet.Shikivideo[]): SmarthardNet.Shikivideo[] {
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
