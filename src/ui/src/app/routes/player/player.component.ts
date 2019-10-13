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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private videosApi: ShikivideosService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let queryParams = new ShikivideosFindParams({
        limit: 'all',
        episode: params['episode'] ? params['episode'] : '1'
      });

      if (!params['animeId']) return;

      this.videosApi.findById(params['animeId'], queryParams)
        .then(videos => {
          this.videos = videos;
          this.currentVideo = videos[0];
        })
        .catch(err => console.error(err)); // TODO: print network error message
    });
  }

}
