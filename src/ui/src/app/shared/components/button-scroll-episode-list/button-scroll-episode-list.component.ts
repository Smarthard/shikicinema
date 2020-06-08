import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';
import {Shikimori} from '../../../types/shikimori';

@Component({
  selector: 'app-button-scroll-episode-list',
  templateUrl: './button-scroll-episode-list.component.html',
  styleUrls: ['./button-scroll-episode-list.component.css']
})
export class ButtonScrollEpisodeListComponent {

  @Input()
  public anime: Shikimori.Anime;

  @Input()
  public unique: SmarthardNet.Unique;

  @Input()
  public chosen: SmarthardNet.Shikivideo;

  @Input()
  public offset: number;

  @Input()
  public limit: number;

  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  private _episodes: number[] = [];

  constructor() {}

  get maxEpisodeAired() {
    return this?.anime?.episodes_aired || this?.anime?.episodes || 0;
  }

  get maxEpisode() {
    return (this?.maxEpisodeAired < this?.anime.episodes ? this?.anime?.episodes : this?.maxEpisodeAired) || 1;
  }

  get isAnimeReleased() {
    return this?.anime?.status === 'released';
  }

  get episodes() {
    return this._episodes.length === this?.maxEpisode
      ? this._episodes
      : new Array<number>(this?.maxEpisode)
        .fill(0)
        .map((value, index) => +index + 1)
  }

  getUrlsSecondLvlDomain(urls: string[]) {
    return urls.map(url => url.split('.').slice(-2).join('.'));
  }

  getOldFagSortedKind(episode: number): string[] {
    return this?.unique[episode].kind.sort((a, b) => {
      switch (true) {
        case (a === 'озвучка') || (a === 'субтитры') && (b === 'оригинал'):
          return -1;
        case (a === 'оригинал') || (a === 'субтитры') && (b === 'озвучка'):
          return 1;
        default:
          return 0;
      }
    })
  }

  getEpisodeTooltip(episode) {
    const isAired = episode <= this?.maxEpisodeAired;
    const isUploaded = this?.unique[episode];

    return isAired
      ? (isUploaded ? `Смотреть ${episode} эпизод` : `Эпизод ${episode} еще не загружен`)
      : `Эпизод ${episode} еще не вышел`;
  }

}
