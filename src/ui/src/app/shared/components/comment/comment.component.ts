import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Shikimori} from '../../../types/shikimori';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements AfterViewChecked {

  @Input()
  comment: Shikimori.Comment;

  @Input()
  showTooltips = true;

  @Input()
  preview = false;

  @Output()
  quote = new EventEmitter<string>();

  @Output()
  reply = new EventEmitter<string>();

  @Output()
  delete = new EventEmitter<Shikimori.Comment>()

  constructor(private _elementRef: ElementRef) {}

  ngAfterViewChecked() {
    const SPOILERS = this._elementRef.nativeElement.querySelectorAll('.shc-spoiler');
    const NEW_SPOILERS = this._elementRef.nativeElement.querySelectorAll('.shc-inline-spoiler, .shc-block-spoiler');

    SPOILERS.forEach((spoiler) => spoiler.onclick = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.toggleSpoiler(spoiler);
    });

    NEW_SPOILERS.forEach((spoiler) => spoiler.onclick = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      spoiler.classList.toggle('is-opened');
    });
  }

  toggleSpoiler(element: Element) {
    const label = element.querySelector('label');
    const content = element.querySelector('div.content') as HTMLDivElement;

    if (label.style.display !== 'none') {
      label.style.display = 'none';
      content.style.display = 'inline';
    } else {
      label.style.display = 'inline';
      content.style.display = 'none';
    }
  }

  userExists(nickname: string): boolean {
    return !!nickname;
  }

  getQuote(comment: Shikimori.Comment) {
    return `[quote=c${comment.id};${comment.user.id};${comment.user.nickname}]\n${comment.body}\n[/quote]\n`;
  }

  getReply(comment: Shikimori.Comment) {
    return `[comment=${comment.id}]${comment.user.nickname}[/comment], `;
  }

  addQuote(comment: Shikimori.Comment) {
    this.quote.emit(this.getQuote(comment));

    /* keep this for stupid function ngOnChanges to be triggered correctly */
    setTimeout(() => this.quote.emit(''), 10);
  }

  addReply(comment: Shikimori.Comment) {
    this.reply.emit(this.getReply(comment));

    /* keep this for stupid function ngOnChanges to be triggered correctly */
    setTimeout(() => this.reply.emit(''), 10);
  }

}
