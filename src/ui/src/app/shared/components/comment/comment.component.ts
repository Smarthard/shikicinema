import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Shikimori} from '../../../types/shikimori';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

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

  constructor() {}

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
