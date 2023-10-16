import {Component, Input} from '@angular/core';
import {Shikimori} from '../../../types/shikimori';
import {SmarthardNet} from '../../../types/smarthard-net';
import {ShikimoriService} from '../../../services/shikimori-api/shikimori.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly SHIKIMORI_URL$ = this.shikimoriService.domain$;

  @Input()
  public anime: Shikimori.Anime;

  @Input()
  public user: Shikimori.User;

  @Input()
  public video: SmarthardNet.Shikivideo;

  @Input()
  public notifications: SmarthardNet.Notification[];

  constructor(
    private readonly shikimoriService: ShikimoriService,
  ) {}
}
