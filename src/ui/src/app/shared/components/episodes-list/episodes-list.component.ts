import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';
import {SettingsService} from '../../../services/settings/settings.service';
import {EpisodesListTypes, ShikicinemaSettings} from '../../../types/ShikicinemaSettings';
import {Shikimori} from '../../../types/shikimori';

@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.css']
})
export class EpisodesListComponent implements OnInit, OnChanges {

  readonly EPISODES_LIST_TYPES = EpisodesListTypes;

  @Input()
  public anime: Shikimori.Anime;

  @Input()
  public episode: number;

  @Input()
  public unique: SmarthardNet.Unique;

  @Input()
  public chosen: SmarthardNet.Shikivideo;

  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  offset = 0;
  limit = 30;
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
    if (this?.episode >= this?.limit || this?.episode <= this?.offset) {
      if (this?.episode < 30) {
        this.offset = 0;
        this.limit = 30;
      } else {
        this.offset = Math.floor(this?.episode / 30) * 30 - 1;
        this.limit = +this?.offset + 30;
      }
    }
  }

}
