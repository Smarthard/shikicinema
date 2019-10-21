import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Shikivideo} from "../../../types/shikivideo";
import {Kind} from "../../../types/kind";

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {

  @Input()
  public videos: Shikivideo[] = [];

  @Input()
  public chosenId: number;

  @Output()
  public change: EventEmitter<Shikivideo> = new EventEmitter<Shikivideo>();

  public chosenKind: Kind = Kind.Unknown;

  constructor() { }

  ngOnInit() {
  }

  public filteredByKind(): Shikivideo[] {
    let filtered: Shikivideo[] = this.videos;

    switch (this.chosenKind) {
      case Kind.Dub:
      case Kind.Raw:
      case Kind.Sub:
        filtered = filtered.filter(value => this.chosenKind == value.kind.toLocaleUpperCase());
        break;
      case Kind.Unknown:
      default:
        break;
    }

    return filtered;
  }

}
