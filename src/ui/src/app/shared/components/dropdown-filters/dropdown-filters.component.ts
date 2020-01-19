import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';

@Component({
  selector: 'app-dropdown-filters',
  templateUrl: './dropdown-filters.component.html',
  styleUrls: ['./dropdown-filters.component.css']
})
export class DropdownFiltersComponent implements OnInit {

  @Input()
  public unique: SmarthardNet.Unique;

  @Input()
  public column: string;

  @Input()
  public episode: number;

  @Input()
  public placeholder: string;

  @Output()
  public change: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {}

  onChange(value: string) {
    this.change.emit(!!value ? value : null);
  }

  getColumns() {
    const episode = this.episode;
    const column = this.column;
    const values = new Set<string>(this.unique[episode][column].sort());

    values.delete(null);
    return values;
  }
}
