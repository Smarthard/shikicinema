import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ShikivideosService} from '../../../services/shikivideos-api/shikivideos.service';
import {HttpParams} from '@angular/common/http';

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
    const params = new HttpParams()
      .set('anime_id', `${this.animeId}`)
      .set('column', this.column)
      .set('episode', `${this.episode}`)
      .set('limit', 'all');

    this.videosApi.getUniqueValues(params)
      .subscribe(
        (values: any) => {
          this.values = new Set([this.placeholder, ...values[this.column].sort()]);
          this.values.delete(null);
        }
      );
  }

}
