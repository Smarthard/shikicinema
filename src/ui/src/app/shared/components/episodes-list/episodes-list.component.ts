import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';
import {SettingsService} from '../../../services/settings/settings.service';
import {EpisodesListTypes, ShikicinemaSettings} from '../../../types/ShikicinemaSettings';

@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.css']
})
export class EpisodesListComponent implements OnInit, OnChanges {

  readonly EPISODES_LIST_TYPES = EpisodesListTypes;

  @Input()
  public unique: SmarthardNet.Unique;

  @Input()
  public chosen: SmarthardNet.Shikivideo;

  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  offset: number = 0;
  limit: number = 30;
  settings: ShikicinemaSettings;

  constructor(
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.settingsService.get()
      .subscribe(
        settings => {
          this.settings = new ShikicinemaSettings(settings);
        }
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chosen && (this.chosen.episode >= this.limit || this.chosen.episode <= this.offset)) {
      if (this.chosen.episode < 30) {
        this.offset = 0;
        this.limit = 30;
      } else {
        this.offset = +this.chosen.episode - 1;
        this.limit = +this.chosen.episode + 29;
      }
    }
  }

}
