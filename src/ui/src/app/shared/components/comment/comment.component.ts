import {Component, Input} from '@angular/core';
import {Shikimori} from '../../../types/shikimori';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  @Input()
  comment: Shikimori.Comment;

  constructor() {}

  userExists(nickname: string): boolean {
    return !!nickname;
  }

}
