import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';

@Component({
  selector: 'app-button-scroll-episode-list',
  templateUrl: './button-scroll-episode-list.component.html',
  styleUrls: ['./button-scroll-episode-list.component.css']
})
export class ButtonScrollEpisodeListComponent {

  @Input()
  public unique: SmarthardNet.Unique;

  @Input()
  public chosen: SmarthardNet.Shikivideo;

  @Input()
  public offset: number;

  @Input()
  public limit: number;

  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  getUrlsSecondLvlDomain(urls: string[]) {
    return urls.map(url => url.split('.').slice(-2).join('.'));
  }

}
