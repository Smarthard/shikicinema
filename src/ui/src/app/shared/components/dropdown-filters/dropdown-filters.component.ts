import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ShikivideosService} from "../../../services/shikivideos-api/shikivideos.service";
import {ShikivideosUniqueParams} from "../../../types/shikivideos-unique-params";

@Component({
  selector: 'app-dropdown-filters',
  templateUrl: './dropdown-filters.component.html',
  styleUrls: ['./dropdown-filters.component.css']
})
export class DropdownFiltersComponent implements OnInit, OnChanges {

  @Input()
  public animeId: number;

  @Input()
  public column: string;

  @Input()
  public episode: number;

  @Input()
  public placeholder: string;

  @Output()
  public change: EventEmitter<string> = new EventEmitter<string>();

  public values: Set<string>;

  constructor(
    private videosApi: ShikivideosService
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const options = new ShikivideosUniqueParams({
      anime_id: this.animeId,
      column: this.column,
      episode: this.episode,
      limit: 'all'
    });

    this.videosApi.getUniqueValues(options)
      .subscribe(
        (values: any) => {
          this.values = new Set([this.placeholder, ...values[this.column].sort()]);
          this.values.delete(null);
        }
      );
  }

}
