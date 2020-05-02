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

  @Output()
  reply = new EventEmitter<string>();

  constructor() {}

  userExists(nickname: string): boolean {
    return !!nickname;
  }

  getReply(comment: Shikimori.Comment) {
    return `[comment=${comment.id}]${comment.user.nickname}[/comment], `;
  }

  addReply(comment: Shikimori.Comment) {
    this.reply.emit(this.getReply(comment));

    /* keep this for stupid function ngOnChanges to be triggered correctly */
    setTimeout(() => this.reply.emit(''), 10);
  }

}
