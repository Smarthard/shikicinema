import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {PageEvent} from '@angular/material/paginator';
import {ShikimoriService} from '../../services/shikimori-api/shikimori.service';
import {ShikivideosService} from '../../services/shikivideos-api/shikivideos.service';
import {Title} from '@angular/platform-browser';
import {debounceTime, mergeMap, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Sort} from '@angular/material/sort';
import {Shikimori} from '../../types/shikimori';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {


  private pageIndexSubject = new BehaviorSubject<number>(0);

  public offset = 0;
  public pageSize = 20;
  public sortedColumn: string = 'id';
  public sortDirection: '' | '-' = '';

  public displayedColumns: string[] = ['id', 'anime_id', 'episode', 'author', 'uploader'];

  readonly uploader$: Observable<Shikimori.User> = this.route.queryParams.pipe(
    switchMap(query => this.shikimori.getUserInfo(query.uploader)),
    publishReplay(1),
    refCount()
  );
  readonly count$: Observable<{ count: number }> = this.uploader$.pipe(
    switchMap(uploader => this.videosApi.contributions(new HttpParams()
      .set('uploader', `${uploader.id}`))
    ),
    publishReplay(1),
    refCount()
  );
  readonly contributions$ = this.pageIndexSubject.pipe(
    debounceTime(100),
    mergeMap(() => this.uploader$),
    switchMap(uploader => this.videosApi.search(new HttpParams()
      .set('offset', `${this.offset}`)
      .set('limit', `${this.pageSize}`)
      .set('uploader', `${uploader.id}`))
    )
  );

  constructor(
      private title: Title,
      private route: ActivatedRoute,
      private shikimori: ShikimoriService,
      private videosApi: ShikivideosService
  ) { }

  ngOnInit() {
    this.uploader$.subscribe(uploader => this.title.setTitle(`Загрузки ${uploader.nickname}`));
  }

  sortData(sort: Sort) {
    this.sortedColumn = sort.active;
    this.sortDirection = sort.direction === 'desc' ? '-' : '';
  }

  changePage(event: PageEvent) {
    const pageIndex = event.pageIndex;

    this.pageIndexSubject.next(pageIndex);
    this.offset = pageIndex * this.pageSize;
  }

}
