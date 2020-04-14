import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Shikimori} from '../../../types/shikimori';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements AfterViewChecked {

  @Input()
  comments: Shikimori.Comment[] = [];

  @Input()
  hasNextPage: boolean = false;

  @Input()
  newCommentsCount: number = 0;

  @Input()
  totalCommentsRemaining: number = 0;

  @Output()
  nextPage = new EventEmitter();

  commentsHidden = false;
  commentsStarts = 0;
  commentsEnds = Number.POSITIVE_INFINITY;
  imgLink: string = null;

  constructor(private _elementRef: ElementRef) {}

  ngAfterViewChecked(): void {
    this.updateEventListeners();
  }

  toggleSpoiler(element: Element) {
    const label = element.querySelector('label');
    const content = <HTMLDivElement> element.querySelector('div.content');

    if ((label.style.display !== 'none') !== !!this.imgLink) {
      label.style.display = 'none';
      content.style.display = 'inline';
    } else {
      label.style.display = 'inline';
      content.style.display = 'none';
    }
  }

  toggleComments() {
    if (!this.commentsHidden) {
      this.commentsStarts = this.comments.length - 20;
      this.commentsEnds = this.comments.length;
    } else {
      this.commentsStarts = 0;
      this.commentsEnds = Number.POSITIVE_INFINITY;
    }

    this.commentsHidden = !this.commentsHidden;
  }

  updateEventListeners() {
    this._elementRef.nativeElement
      .querySelectorAll('.shc-spoiler')
      .forEach((spoiler) => spoiler.onclick = () => this.toggleSpoiler(spoiler));

    this._elementRef.nativeElement
      .querySelectorAll('.shc-image img')
      .forEach((img) => {
        const parent = img.parentElement;

        if (!parent.onclick) {
          parent.onclick =  (evt) => {
            evt.preventDefault();
            this.openImg(parent.href);
          };
        }
      });
  }

  openImg(src: string) {
    document.body.style.overflow = 'hidden';
    this.imgLink = src;
  }

  closeImg() {
    document.body.style.overflow = 'visible';
    this.imgLink = null;
  }

  userExists(nickname: string): boolean {
    return !!nickname;
  }

  trackComment(index: number, item: Shikimori.Comment) {
    return item.id;
  }

}
