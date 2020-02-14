import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SmarthardNet} from '../../../types/smarthard-net';

@Component({
  selector: 'app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.css']
})
export class RequestDialogComponent implements OnInit {

  readonly REQUEST_TYPES = ['change', 'issue', 'delete'];
  readonly QUALITIES = ['TV', 'DVD', 'BD', 'unknown'];
  readonly KINDS = ['озвучка', 'субтитры', 'оригинал'];
  readonly LANGUAGES = ['russian', 'english', 'original', 'unknown'];

  selectedRequestType = this.REQUEST_TYPES[0];
  newVideo: SmarthardNet.Shikivideo = new SmarthardNet.Shikivideo();
  comment: string;

  constructor(
    private dialogRef: MatDialogRef<RequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRequestDialogData
  ) {}

  ngOnInit() {
    this.newVideo = this._copy(this.data.video);
  }

  private _copy(obj: object) {
    return JSON.parse(JSON.stringify(obj));
  }

  close() {
    this.dialogRef.close();
  }

  commentPlaceholder(type: string) {
    switch (type) {
      case 'change':
        return 'Оставьте Ваш комментарий здесь';
      case 'issue':
        return 'Опишите проблему';
      case 'delete':
        return 'Напишите причину, по которой нужно удалить видео';
    }
  }

  isVideoChanged(video: SmarthardNet.Shikivideo) {
    for (const key in video) {
      if (video[key] !== this.data.video[key]) {
        return true;
      }
    }

    return false;
  }

  isSendButtonBlocked() {
    if (this.selectedRequestType === 'change') {
      return !this.isVideoChanged(this.newVideo);
    } else {
      return !this.comment
    }
  }

  private _translateLocalType(type: string) {
    switch (type) {
      case 'change':
        return 'shikivideos';
      case 'issue':
        return 'shikivideos_issue';
      case 'delete':
        return 'shikivideos_delete';
    }
  }

  async send() {
    const changedVideo = this._copy(this.newVideo);
    const request: SmarthardNet.IRequest = {
      type: this._translateLocalType(this.selectedRequestType),
      requester: this.data.requester,
      target_id: this.data.video.id,
      comment: `${this.comment || ''}`,
      request: changedVideo
    };

    for (const key in changedVideo) {
      if (changedVideo[key] === this.data.video[key]) {
        delete changedVideo[key]
      }
    }

    this.dialogRef.close(request);
  }

}

export interface IRequestDialogData {
  video: SmarthardNet.Shikivideo,
  requester: string
}
