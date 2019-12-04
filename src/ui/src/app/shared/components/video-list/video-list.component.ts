import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {

  @Input()
  public videos: SmarthardNet.Shikivideo[] = [];

  @Input()
  public chosen: SmarthardNet.Shikivideo;

  @Output()
  public change: EventEmitter<SmarthardNet.Shikivideo> = new EventEmitter<SmarthardNet.Shikivideo>();

  public chosenKind: SmarthardNet.Kind = SmarthardNet.Kind.Unknown;

  constructor() { }

  ngOnInit() { }

  public filteredByKind(): SmarthardNet.Shikivideo[] {
    let filtered: SmarthardNet.Shikivideo[] = this.videos;

    switch (this.chosenKind) {
      case SmarthardNet.Kind.Dub:
      case SmarthardNet.Kind.Raw:
      case SmarthardNet.Kind.Sub:
        filtered = filtered.filter(value => this.chosenKind == value.kind.toLocaleUpperCase());
        break;
      case SmarthardNet.Kind.Unknown:
      default:
        break;
    }

    return filtered;
  }

}
