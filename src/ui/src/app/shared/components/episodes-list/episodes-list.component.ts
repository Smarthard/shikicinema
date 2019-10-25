import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {ShikivideosService} from '../../../services/shikivideos-api/shikivideos.service';
import {SmarthardNet} from '../../../types/smarthard-net';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.css']
})
export class EpisodesListComponent implements OnInit, OnChanges {

  @Input()
  public animeId: number;

  @Input()
  public chosenEp: number;

  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  public unique: SmarthardNet.Unique;
  public episodes: string[];
  public limit: number = 30;

  constructor(
    private videosApi: ShikivideosService
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const animeId: SimpleChange = changes.animeId;
    const params = new HttpParams()
      .set('anime_id', animeId.currentValue)
      .set('column', 'url+kind')
      .set('limit', 'all');

    this.videosApi.getUniqueValues(params)
      .subscribe((values: SmarthardNet.Unique[]) => {
        this.unique = values;
        this.episodes = Object.keys(this.unique);
      });
  }

  public getUrlsSecondLvlDomain(urls: string[]) {
    return urls.map(url => url.split('.').slice(-2).join('.'));
  }
}
