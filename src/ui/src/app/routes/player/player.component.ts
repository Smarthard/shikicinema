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

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  public currentVideo: SmarthardNet.Shikivideo;
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
    private videosApi: ShikivideosService,
    private shikimori: ShikimoriService,
    private title: Title
  ) {}

  ngOnInit() {
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
          this.videos = videos.map(v => new SmarthardNet.Shikivideo(v));
          this.changeVideo(this.videos[0]);
          this.title.setTitle(`
            ${this.currentVideo.anime_russian || this.currentVideo.anime_english}
             - эпизод ${this.episode}
          `);
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

  public async changeEpisode(episode: number) {
    if (episode && episode > 0 && episode <= this.maxEpisode) {
      await this.router.navigate([`/${this.animeId}/${episode}`]);
    }
  }

  changeVideo(video: SmarthardNet.Shikivideo) {
    this.currentVideo = video;
  }

  synchronize() {
    chrome.runtime.sendMessage({ shikimori_sync: true });
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
    this.changeEpisode(+episode + 1);
    this.notify.add(new Notification(NotificationType.OK, 'Просмотрено'));
  }

  openUploadForm() {
    this.auth.shikivideosSync();
    this.isUploadOpened = !this.isUploadOpened;
  }
}
