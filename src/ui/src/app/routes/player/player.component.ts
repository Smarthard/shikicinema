/// <reference types="@types/chrome" />
import {Component, OnInit} from '@angular/core';
import {Shikivideo} from '../../types/shikivideo';
import {ShikivideosService} from '../../services/shikivideos-api/shikivideos.service';
import {ShikimoriService} from '../../services/shikimori-api/shikimori.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {VideoFilter} from '../../types/video-filter';
import {ShikimoriUser} from '../../types/ShikimoriUser';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  public currentVideo: Shikivideo;
  public videos: Array<Shikivideo>;

  public animeId: number;
  public episode: number = 1;
  public userRate: any;
  public maxEpisode: number = Number.POSITIVE_INFINITY;
  public filter: VideoFilter = new VideoFilter();

  public isSynced: boolean = false;
  private user: ShikimoriUser;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
          this.videos = videos.map(v => new Shikivideo(v));
          this.changeVideo(this.videos[0]);
          this.title.setTitle(`
            ${this.currentVideo.anime_russian || this.currentVideo.anime_english}
             - эпизод ${this.episode}
          `);
        },
          err => console.error(err) // TODO: print network error message
        );

      this.videosApi.getAnimeMaxLoadedEp(this.animeId)
        .subscribe(
          series => this.maxEpisode = series.length,
          err => console.error(err) // TODO: same here
        );

      this.shikimori.whoAmI()
        .subscribe(
          user => {
            this.user = new ShikimoriUser(user);
            this.isSynced = user != null;

            this.shikimori.getUserRates(new HttpParams()
              .set('user_id', `${this.user.id}`)
              .set('target_type', 'Anime')
              .set('target_id', `${this.animeId}`)
            )
              .subscribe(
                userRate => this.userRate = userRate[0]
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

  changeVideo(video: Shikivideo) {
    this.currentVideo = video;
  }

  synchronize() {
    chrome.runtime.sendMessage({ shikimori_sync: true });
    setTimeout(() => window.location.reload(), 700);
  }

  watched(episode: number): boolean {
    return this.userRate && this.userRate.episodes >= episode;
  }

  markAsWatched(episode: number) {
    this.userRate.episodes++;
  }
}
