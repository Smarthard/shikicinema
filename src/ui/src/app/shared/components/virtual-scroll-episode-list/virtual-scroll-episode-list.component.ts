import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {debounceTime} from 'rxjs/operators';
import {Shikimori} from '../../../types/shikimori';

@Component({
  selector: 'app-virtual-scroll-episode-list',
  templateUrl: './virtual-scroll-episode-list.component.html',
  styleUrls: ['./virtual-scroll-episode-list.component.css']
})
export class VirtualScrollEpisodeListComponent implements AfterViewInit, OnInit, OnChanges {

  private _episodeElemMaxHeight = 31;

  @Input()
  public anime: Shikimori.Anime;

  @Input()
  public unique: SmarthardNet.Unique;

  @Input()
  public chosen: SmarthardNet.Shikivideo;

  @Input()
  public offset: number;

  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild(CdkVirtualScrollViewport, { static: true })
  episodeViewPort: CdkVirtualScrollViewport;

  private _episodes: number[] = [];

  constructor(private _elementRef: ElementRef) {}

  private _getEpisodeElementMaxHeight() {
    const DIV_EPISODES = [ ...this._elementRef.nativeElement.querySelectorAll('.episodes') ];
    const HEIGHT_OF_EACH_DIV = DIV_EPISODES.map((div) => div.getBoundingClientRect().height);
    const AVG_HEIGHT = HEIGHT_OF_EACH_DIV.reduce((a, b) => a + b, 0) / HEIGHT_OF_EACH_DIV.length;

    this._episodeElemMaxHeight = Math.max(31, AVG_HEIGHT);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.episodeViewPort.scrollToIndex(this?.chosen?.episode - 1);
      this._getEpisodeElementMaxHeight();
    }, 50);
  }

  ngOnInit(): void {
    this.episodeViewPort.elementScrolled()
      .pipe(debounceTime(500))
      .subscribe(() => this._getEpisodeElementMaxHeight())
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.episodeViewPort.scrollToIndex(this?.chosen?.episode - 1, 'smooth');
  }

  get maxEpisodeAired() {
    return this?.anime?.episodes_aired || this?.anime?.episodes || 0;
  }

  get maxEpisode() {
    return (this?.maxEpisodeAired < this?.anime.episodes ? this?.anime?.episodes : this?.maxEpisodeAired) || 1;
  }

  get episodes() {
    return this._episodes.length === this?.maxEpisode
      ? this._episodes
      : new Array<number>(this?.maxEpisode)
        .fill(0)
        .map((value, index) => +index + 1)
  }

  getEpisodeTooltip(episode) {
    const isAired = episode <= this?.maxEpisodeAired;
    const isUploaded = this?.unique[episode];

    return isAired
      ? (isUploaded ? `Смотреть ${episode} эпизод` : `Эпизод ${episode} еще не загружен`)
      : `Эпизод ${episode} еще не вышел`;
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

  calcHeight() {
    const EPISODES_COUNT = this?.episodes.length;
    return EPISODES_COUNT > 30 ? 30 * this._episodeElemMaxHeight : EPISODES_COUNT * this._episodeElemMaxHeight;
  }

}
