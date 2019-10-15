import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {ShikivideosService} from "../../../services/shikivideos-api/shikivideos.service";
import {ShikivideosUniqueParams} from "../../../types/shikivideos-unique-params";
import {ShikivideosUnique} from "../../../types/shikivideos-unique";

@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.css']
})
export class EpisodesListComponent implements OnInit, OnChanges {

  @Input()
  public animeId: number;

  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  public unique: ShikivideosUnique;
  public episodes: string[];

  constructor(
    private videosApi: ShikivideosService
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const animeId: SimpleChange = changes.animeId;
    let params = new ShikivideosUniqueParams({
      anime_id: animeId.currentValue,
      column: 'url+kind',
      limit: 'all'
    });

    this.videosApi.getUniqueValues(params)
      .subscribe((values: ShikivideosUnique[]) => {
        this.unique = values;
        this.episodes = Object.keys(this.unique);
      });
  }

  public getUrlsSecondLvlDomain(urls: string[]) {
    return urls.map(url => url.split('.').slice(-2).join('.'));
  }
}
