import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';

@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.css']
})
export class EpisodesListComponent implements OnChanges {

  @Input()
  public unique: SmarthardNet.Unique;

  @Input()
  public chosen: SmarthardNet.Shikivideo;

  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  offset: number = 0;
  limit: number = 30;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chosen.episode >= this.limit || this.chosen.episode <= this.offset) {
      if (this.chosen.episode < 30) {
        this.offset = 0;
        this.limit = 30;
      } else {
        this.offset = +this.chosen.episode - 1;
        this.limit = +this.chosen.episode + 29;
      }
    }
  }

  getUrlsSecondLvlDomain(urls: string[]) {
    return urls.map(url => url.split('.').slice(-2).join('.'));
  }

  getEpisodes() {
    return Object.keys(this.unique);
  }
}
