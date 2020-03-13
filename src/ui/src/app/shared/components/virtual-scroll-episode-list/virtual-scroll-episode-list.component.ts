import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-virtual-scroll-episode-list',
  templateUrl: './virtual-scroll-episode-list.component.html',
  styleUrls: ['./virtual-scroll-episode-list.component.css']
})
export class VirtualScrollEpisodeListComponent implements AfterViewInit, OnChanges {

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

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => this.episodeViewPort.scrollToIndex(this.offset), 50);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.episodeViewPort.scrollToIndex(this.offset, 'smooth');
  }

  getUrlsSecondLvlDomain(urls: string[]) {
    return urls.map(url => url.split('.').slice(-2).join('.'));
  }

}
