import { Component, Input } from '@angular/core';
import { Shikimori } from '../../../types/shikimori';
import { ShikimoriService } from '../../../services/shikimori-api/shikimori.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent {
  readonly shikimoriUrl$ = this.shikimori.domain$;

  @Input()
  public uploadedByUser: Shikimori.User;

  @Input()
  public isForeignSource: boolean;

  constructor(private shikimori: ShikimoriService) {}
}
