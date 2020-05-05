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

@Component({
  selector: 'app-virtual-scroll-episode-list',
  templateUrl: './virtual-scroll-episode-list.component.html',
  styleUrls: ['./virtual-scroll-episode-list.component.css']
})
export class VirtualScrollEpisodeListComponent implements AfterViewInit, OnInit, OnChanges {

  private _episodeElemMaxHeight = 31;

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

  constructor(private _elementRef: ElementRef) {}

  private _getEpisodeElementMaxHeight() {
    const DIV_EPISODES = [ ...this._elementRef.nativeElement.querySelectorAll('.episodes') ];
    const HEIGHT_OF_EACH_DIV = DIV_EPISODES.map((div) => div.getBoundingClientRect().height);

    this._episodeElemMaxHeight = Math.max.apply(null, [31, ...HEIGHT_OF_EACH_DIV]);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.episodeViewPort.scrollToIndex(this.offset);
      this._getEpisodeElementMaxHeight();
    }, 50);
  }

  ngOnInit(): void {
    this.episodeViewPort.elementScrolled()
      .pipe(debounceTime(100))
      .subscribe(() => this._getEpisodeElementMaxHeight())
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.episodeViewPort.scrollToIndex(this.offset, 'smooth');
  }

  getUrlsSecondLvlDomain(urls: string[]) {
    return urls.map(url => url.split('.').slice(-2).join('.'));
  }

  calcHeight() {
    const EPISODES_COUNT = Object.keys(this.unique).length;
    return EPISODES_COUNT > 30 ? 30 * this._episodeElemMaxHeight : EPISODES_COUNT * this._episodeElemMaxHeight;
  }

}
