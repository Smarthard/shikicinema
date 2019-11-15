/// <reference types="@types/chrome" />
import {Component, OnInit} from '@angular/core';
import {ShikivideosService} from '../../services/shikivideos-api/shikivideos.service';
import {ShikimoriService} from '../../services/shikimori-api/shikimori.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Shikimori} from '../../types/shikimori';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {SmarthardNet} from '../../types/smarthard-net';
import {AuthService} from '../../services/auth/auth.service';
import {NotificationsService} from '../../services/notifications/notifications.service';
import {Notification, NotificationType} from '../../types/notification';
import {ShikicinemaSettings} from '../../types/ShikicinemaSettings';
import {SettingsService} from '../../services/settings/settings.service';
import {UserPreferencesService} from '../../services/user-preferences/user-preferences.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  public EMPTY_VIDEO_URL = '/assets/dvd.png'; // black on black

  public currentVideo = new SmarthardNet.Shikivideo();
  public settings = new ShikicinemaSettings();
  public videos: Array<SmarthardNet.Shikivideo>;

  public animeId: number;
  public episode: number = 1;
  public userRate: Shikimori.UserRate;
  public maxEpisode: number = Number.POSITIVE_INFINITY;
  public filter = new SmarthardNet.VideoFilter();

  public isSynced: boolean = false;
  public isUploadOpened: boolean = false;
  public user: Shikimori.User;

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

  ngOnInit() {
    this.settingsService.get()
      .subscribe(
        settings => this.settings = new ShikicinemaSettings(settings)
      );

    this.route.params.subscribe(params => {
      this.animeId = params['animeId'];
      this.episode = params['episode'];

      if (!params['animeId']) return;

      this.videosApi.findById(this.animeId, new HttpParams()
        .set('limit', 'all')
        .set('episode', params['episode'] ? params['episode'] : this.episode)
      )
        .subscribe(
          videos => {
          let query = this.route.snapshot.queryParams;
          let title = 'Shikicinema';
          this.videos = videos.map(v => new SmarthardNet.Shikivideo(v));
          let videoById = this.videos.filter(vid => query && query.id && vid.id == query.id)[0];

          this.changeVideo( query && query.id && videoById ? videoById : this._chooseFavourite(this.videos)[0]);

          title = this.videos.length > 0 ? this.currentVideo.anime_russian || this.currentVideo.anime_english : title;
          this.title.setTitle(this.currentVideo ? `${title} - эпизод ${this.episode}` : title);
        },
          err => {
            console.error(err);
            this.notify.add(new Notification(NotificationType.ERROR, 'Не удалось загрузить видео!', err));
          }
        );

      this.videosApi.getAnimeMaxLoadedEp(this.animeId)
        .subscribe(
          series => this.maxEpisode = series.length,
          err => {
            console.error(err);
            this.notify.add(new Notification(NotificationType.ERROR, 'Не удалось загрузить видео!', err));
          }
        );

      this.shikimori.whoAmI(new HttpHeaders()
        .set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma', 'no-cache')
      )
        .subscribe(
          user => {
            this.user = new Shikimori.User(user);
            this.isSynced = user != null;

            this.shikimori.getUserRates(new HttpParams()
              .set('user_id', `${this.user.id}`)
              .set('target_type', 'Anime')
              .set('target_id', `${this.animeId}`)
            )
              .subscribe(
                userRate => this.userRate = new Shikimori.UserRate(userRate[0])
              );
          }
        );
    });
  }

  public async changeEpisode(episode: number, saveAsFav?: boolean) {
    if (saveAsFav) {
      const animeId = this.animeId;
      const fav = new SmarthardNet.VideoFilter({
        author: this.currentVideo.author,
        player: this.currentVideo.getSecondLvlDomain(),
        quality: this.currentVideo.quality
      });

      this.preferenses.set(animeId, fav);
    }

    if (episode && episode > 0 && episode <= this.maxEpisode) {
      await this.router.navigate([`/${this.animeId}/${episode}`]);
    }
  }

  changeVideo(video: SmarthardNet.Shikivideo) {
    this.currentVideo = video;
  }

  async synchronize() {
    await this.auth.shikimoriSync();
    setTimeout(() => window.location.reload(), 700);
  }

  watched(episode: number): boolean {
    return this.userRate && this.userRate.episodes >= episode;
  }

  async markAsWatched(episode: number) {
    if (this.userRate.id) {
      if (this.userRate.episodes < episode) {
        const userRate = await this.shikimori.incUserRates(this.userRate).toPromise();
        this.userRate = new Shikimori.UserRate(userRate)
      }
    } else {
      this.userRate = new Shikimori.UserRate({
        user_id: this.user.id,
        target_id: this.animeId,
        target_type: 'Anime',
        episodes: episode
      });

      await this.shikimori.createUserRates(this.userRate).toPromise();
    }
    this.changeEpisode(+episode + 1, true);
    this.notify.add(new Notification(NotificationType.OK, 'Просмотрено'));
  }

  openUploadForm() {
    this.auth.shikivideosSync();
    this.isUploadOpened = !this.isUploadOpened;
  }

  private _chooseFavourite(videos: SmarthardNet.Shikivideo[]): SmarthardNet.Shikivideo[] {
    const preferences = this.preferenses.get(this.animeId);
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
