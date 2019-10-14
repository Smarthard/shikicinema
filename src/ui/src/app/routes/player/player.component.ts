import {Component, OnInit} from '@angular/core';
import {Shikivideo} from "../../types/shikivideo";
import {ShikivideosService} from "../../services/shikivideos-api/shikivideos.service";
import {ShikivideosFindParams} from "../../types/shikivideos-find-params";
import {ActivatedRoute, Router} from "@angular/router";

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private videosApi: ShikivideosService
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
        .then(videos => {
          this.videos = videos;
          this.currentVideo = videos[0];
        })
        .catch(err => console.error(err)); // TODO: print network error message

      this.videosApi.getAnimeMaxLoadedEp(this.animeId)
        .then(length => this.maxEpisode = length)
        .catch(err => console.error(err)); // TODO: same here
    });
  }

  public async changeEpisode(episode: number) {
    if (episode && episode > 0 && episode <= this.maxEpisode) {
      await this.router.navigate([`/${this.animeId}/${episode}`]);
    }
  }

}
