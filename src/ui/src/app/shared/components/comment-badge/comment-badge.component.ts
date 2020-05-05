import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-comment-badge',
  templateUrl: './comment-badge.component.html',
  styleUrls: ['./comment-badge.component.css']
})
export class CommentBadgeComponent {

  @Input()
  type: 'preview' | 'offtop';

  @Input()
  toggleable = false;

  @Input()
  on = true;

  constructor() {}

  get isPreview() {
    return this.type === 'preview';
  }

  get isOfftop() {
    return this.type === 'offtop';
  }

}
