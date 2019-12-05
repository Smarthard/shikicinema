import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';

@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.css']
})
export class EpisodesListComponent implements OnInit {

  @Input()
  public unique: SmarthardNet.Unique;

  @Input()
  public chosen: SmarthardNet.Shikivideo;

  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  public limit: number = 30;

  constructor() { }

  ngOnInit() {}

  getUrlsSecondLvlDomain(urls: string[]) {
    return urls.map(url => url.split('.').slice(-2).join('.'));
  }

  getEpisodes() {
    return Object.keys(this.unique);
  }
}
