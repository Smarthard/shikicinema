import {Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, Output} from '@angular/core';
import {Shikimori} from '../../../types/shikimori';

@Component({
  selector: 'app-bubble-view',
  templateUrl: './bubble-view.component.html',
  styleUrls: ['./bubble-view.component.css']
})
export class BubbleViewComponent implements OnChanges {

  constructor(private el: ElementRef) {}

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
    const X = +this.coordinates.x + 10 || 0;
    const Y = +this.coordinates.y || 0;
    const HOST_ELEM_RECT = this.el.nativeElement.getBoundingClientRect();
    const VIEWPORT = {
      width:  screen.width,
      height: screen.height,
      offsetTop: pageYOffset
    };

    if (X + HOST_ELEM_RECT.width > VIEWPORT.width) {
      this.left = X - HOST_ELEM_RECT.width;
    } else if (X < 0) {
      this.left = X + HOST_ELEM_RECT.width;
    } else {
      this.left = X;
    }

    if (Y < VIEWPORT.offsetTop || Y + HOST_ELEM_RECT.height > VIEWPORT.offsetTop + VIEWPORT.height) {
      this.top = Y - HOST_ELEM_RECT.height;
    } else {
      this.top = Y - HOST_ELEM_RECT.height / 2;
    }
  }

}
