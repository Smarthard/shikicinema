import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, iif, Observable, of, ReplaySubject} from 'rxjs';
import {Shikimori} from '../../types/shikimori';
import {catchError, debounceTime, distinctUntilChanged, map, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {ShikimoriService} from '../shikimori-api/shikimori.service';
import {HttpParams} from '@angular/common/http';
import {ShikivideosService} from '../shikivideos-api/shikivideos.service';
import {KodikService} from '../kodik-api/kodik.service';
import {SmarthardNet} from '../../types/smarthard-net';
import {Notification, NotificationType} from '../../types/notification';
import {NotificationsService} from '../notifications/notifications.service';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  private readonly _animeIdSubject = new ReplaySubject<number>(1);
  private readonly _currentVideoSubject = new ReplaySubject<SmarthardNet.Shikivideo>(1);
  private readonly _episodeSubject = new BehaviorSubject<number>(1);

  readonly animeId$ = this._animeIdSubject.pipe(distinctUntilChanged());
  readonly episode$ = this._episodeSubject.pipe(distinctUntilChanged());

  readonly anime$: Observable<Shikimori.Anime> = this.animeId$.pipe(
    switchMap(animeId => this.shikimori.getAnime(animeId)),
    publishReplay(1),
    refCount()
  );

  readonly shikivideos$ = this.episode$
    .pipe(
      (episode$) => combineLatest([this.anime$, episode$]),
      switchMap(([anime, episode]) => this.shikivideos.findById(anime.id, new HttpParams()
        .set('limit', 'all')
        .set('episode', `${episode}`)
      ))
    );

  readonly kodikvideos$ = this.episode$
    .pipe(
      (episode$) => combineLatest([this.anime$, episode$]),
      switchMap(([anime, episode]) => this.kodik.search(anime, episode)),
      publishReplay(1),
      refCount()
    );

  readonly videos$ = this.shikivideos$
    .pipe(
      (shikivideos$) => combineLatest([shikivideos$, this.kodikvideos$]),
      map(([shikivideos, kodikvideos]) => [...shikivideos, ...kodikvideos]),
      map((videos: SmarthardNet.Shikivideo[]) => videos.sort((a, b) => `${a.author}`.localeCompare(`${b.author}`))),
      catchError(err => this._shikivideosErrorHandler(err)),
      publishReplay(1),
      refCount()
    );

  readonly shikivideosUnique$: Observable<SmarthardNet.Unique> = this.animeId$.pipe(
    switchMap(animeId => this.shikivideos.getUniqueValues(new HttpParams()
      .set('anime_id', `${animeId}`)
      .set('column', 'author+kind+language+url+quality')
      .set('limit', 'all')
    )),
    publishReplay(1),
    refCount()
  );

  readonly kodikUnique$ = this.kodikvideos$
    .pipe(
      switchMap(() => this.anime$),
      switchMap((anime: Shikimori.Anime) => this.kodik.getUnique(anime)),
    );

  readonly unique$ = this.anime$
    .pipe(
      switchMap(() => this.shikivideosUnique$),
      (shikivideosUnique) => combineLatest([shikivideosUnique, this.kodikUnique$]),
      map((uniques: SmarthardNet.Unique[]) => SmarthardNet.mergeUniques(uniques))
    );

  readonly uploader$ = this._currentVideoSubject
    .pipe(
      debounceTime(250),
      map((video: SmarthardNet.Shikivideo) => video.uploader),
      switchMap((uploader: string) => iif(
        () => !!uploader,
        this.shikimori.getUserInfo(uploader),
        of(null)
      )),
      catchError((err) => {
        console.error('Cannot get uploader info', err);
        return of(null);
      })
    );

  private _anime: Shikimori.Anime = null;
  private _currentVideo: SmarthardNet.Shikivideo = null;
  private _episode = 1;

  private _shikivideosErrorHandler = (err) => {
    console.error(err);
    this.notify.add(new Notification(NotificationType.ERROR, 'Не удалось загрузить видео!', err));
    return of([] as SmarthardNet.Shikivideo[]);
  };

  constructor(
    private kodik: KodikService,
    private notify: NotificationsService,
    private preferenses: UserPreferencesService,
    private shikimori: ShikimoriService,
    private shikivideos: ShikivideosService
  ) {
    this.anime$.subscribe((anime) => this._anime = anime);
    this.episode$.subscribe((episode) => this._episode = episode);
  }

  public setAnimeId(animeId: number) {
    this._animeIdSubject.next(animeId);
  }

  public setEpisode(episode: number) {
    this._episodeSubject.next(episode);
  }

  public get anime() {
    return this._anime;
  }

  public set currentVideo(video: SmarthardNet.Shikivideo) {
    const fav = new SmarthardNet.VideoFilter(video.author, null, null, video.url, video.quality);
    this.preferenses.set(+video.anime_id, fav);
    this._currentVideo = video;
    this._currentVideoSubject.next(video);
  }

  public get currentVideo(): SmarthardNet.Shikivideo {
    return this._currentVideo;
  }

  public get episode() {
    return this._episode;
  }
}
