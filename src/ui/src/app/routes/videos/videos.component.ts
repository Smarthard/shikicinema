import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpParams} from "@angular/common/http";
import {PageEvent} from "@angular/material/paginator";
import {ShikimoriService} from '../../services/shikimori-api/shikimori.service';
import {ShikivideosService} from '../../services/shikivideos-api/shikivideos.service';
import {Shikimori} from '../../types/shikimori';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'anime_id', 'episode', 'author', 'uploader'];

  public count: number = 0;
  public pageSize = 20;
  public contributions;

  public uploader: Shikimori.User;

  private prevPageEvent: PageEvent;

  constructor(
      private title: Title,
      private route: ActivatedRoute,
      private shikimori: ShikimoriService,
      private videosApi: ShikivideosService
  ) { }

  ngOnInit() {
    this.route.queryParams
        .subscribe(
            query => {
              const uploader = query.uploader;

              this.loadContributions(uploader);
            }
        )
  }

  loadContributions(uploader: string, page: number = 0, size: number = 20) {
    const userParams = new HttpParams();

    this.shikimori.getUserInfo(uploader, userParams)
      .subscribe(
        user => {
          const contribParams = new HttpParams()
            .set('offset', `${page * size}`)
            .set('limit', `${size}`)
            .set('uploader', `${user.nickname} ${user.id}`);

          if (!/^\d+$/.test(uploader)) {
            userParams.set('is_nickname', '1');
          }

          this.videosApi.search(contribParams)
            .subscribe(
              value => this.contributions = value
            );

          this.videosApi.contributions(contribParams)
            .subscribe(
              value => this.count = value.count
            );
          this.uploader = new Shikimori.User(user);
          this.title.setTitle(`Загрузки ${this.uploader.nickname}`);
        }
      );
  }

  changePage(event: PageEvent) {
    this.prevPageEvent = event;
    this.loadContributions(this.uploader.nickname, event.pageIndex, event.pageSize);
  }

}
