import {Component, EventEmitter, HostBinding, Input, OnChanges, Output} from '@angular/core';
import {Shikimori} from '../../../types/shikimori';

@Component({
  selector: 'app-bubble-view',
  templateUrl: './bubble-view.component.html',
  styleUrls: ['./bubble-view.component.css']
})
export class BubbleViewComponent implements OnChanges {

  constructor() {}

  @Input()
  comment: Shikimori.Comment;

  @Input()
  coordinates: { x: string | number, y: string | number };

  @Output()
  hide = new EventEmitter();

  @HostBinding('style.left.px')
  left: string | number;

  @HostBinding('style.top.px')
  top: string | number;

  ngOnChanges(): void {
    this.top = +this.coordinates?.y || 0;
    this.left = +this.coordinates?.x + 10 || 0;
  }

}
