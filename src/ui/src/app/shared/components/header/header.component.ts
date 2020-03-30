import {Component, Input} from '@angular/core';
import {Shikimori} from '../../../types/shikimori';
import {SmarthardNet} from '../../../types/smarthard-net';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly SHIKIMORI_URL = 'https://shikimori.one';

  @Input()
  public anime: Shikimori.Anime;

  @Input()
  public user: Shikimori.User;

  @Input()
  public video: SmarthardNet.Shikivideo;

  @Input()
  public notifications: SmarthardNet.Notification[];

  constructor() {}

  openUrl(url: string, target: '_self' | '_blank' = '_self') {
    window.open(url, target)
  }

}
