import {Component, OnInit} from '@angular/core';
import {Shikivideo} from "../../types/shikivideo";
import {ShikivideosService} from "../../services/shikivideos-api/shikivideos.service";
import {ShikivideosFindParams} from "../../types/shikivideos-find-params";
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {VideoFilter} from "../../types/video-filter";

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
  public maxEpisode: number = Number.POSITIVE_INFINITY;
  public filter: VideoFilter = new VideoFilter();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private videosApi: ShikivideosService,
    private title: Title
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.animeId = params['animeId'];
      this.episode = params['episode'];

      let queryParams = new ShikivideosFindParams({
        limit: 'all',
        episode: params['episode'] ? params['episode'] : this.episode
      });

      if (!params['animeId']) return;

      this.videosApi.findById(this.animeId, queryParams)
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
        )
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
}
