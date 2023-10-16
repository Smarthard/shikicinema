import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { ShikimoriService } from '../../../services/shikimori-api/shikimori.service';

@Component({
  selector: 'app-smilley',
  templateUrl: './smilley.component.html',
  styleUrls: ['./smilley.component.css']
})
export class SmilleyComponent {

  readonly SHIKIMORI_DOMAIN$ = this.shikimoriService.domain$;
  readonly SMILEY_URL = '/images/smileys/';

  @Input()
  smiley: string;

  @Output()
  pick = new EventEmitter<string>();

  constructor(
    private readonly shikimoriService: ShikimoriService,
  ) {}
}
