import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Shikimori} from '../../../types/shikimori';
import {Bubble} from 'src/app/types/bubble';
import {CommentsService} from '../../../services/comments/comments.service';
import {NotificationsService} from '../../../services/notifications/notifications.service';
import {Notification, NotificationType} from '../../../types/notification';
import Timeout = NodeJS.Timeout;

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements AfterViewChecked {

  @Input()
  comments: Shikimori.Comment[] = [];

  @Input()
  hasNextPage = false;

  @Input()
  newCommentsCount = 0;

  @Input()
  totalCommentsRemaining = 0;

  @Output()
  nextPage = new EventEmitter();

  @Output()
  quote = new EventEmitter<string>();

  @Output()
  reply = new EventEmitter<string>();

  commentsHidden = false;
  imgLink: string = null;
  imgBroken = false;
  bubbledComments: Bubble<Shikimori.Comment>[] = [];
  bubbledCommentsCache = new Map<number, Bubble<Shikimori.Comment>>();
  bubbledInTimeout: Timeout;
  bubbledOutTimeout: Timeout;
  deletedCommentsIds = new Set<number>();

  constructor(
    private _comments: CommentsService,
    private _elementRef: ElementRef,
    private _notifications: NotificationsService
  ) {}

  ngAfterViewChecked(): void {
    this.updateEventListeners();
  }

  private async _getComment(id: number): Promise<Shikimori.Comment> {
    let comment: Shikimori.Comment;

    if (this.bubbledCommentsCache.has(id)) {
      comment = this.bubbledCommentsCache.get(id).data;
    } else if (this.comments.some((c) => c.id === id)) {
      comment = this.comments.find((c) => c.id === id);
    } else {
      comment = await this._comments.getCommentById(id).toPromise();
    }

    return Promise.resolve(comment);
  }

  private _findBubbleById(bubbleId: number): Bubble<Shikimori.Comment> {
    const BUBBLE_INDEX = this.bubbledComments.findIndex((c) => c.data.id === bubbleId);
    return BUBBLE_INDEX === -1 ? null : this.bubbledComments[BUBBLE_INDEX];
  }

  private _getBubbleMaxZIndex(): number {
    const Z_INDICES = this.bubbledComments
      .filter(v => !v.hidden)
      .map(v => v.zIndex);

    return Math.max.apply(null,[ 1, ...Z_INDICES]);
  }

  private _showBubble(bubble: Bubble<Shikimori.Comment>) {
    const BUBBLE = this._findBubbleById(bubble.data.id);

    if (BUBBLE) {
      BUBBLE.coordinates = bubble.coordinates;
      BUBBLE.hidden = false;
      BUBBLE.zIndex = +this._getBubbleMaxZIndex() + 1;
    } else {
      this.bubbledComments.push(bubble);
      this.bubbledCommentsCache.set(bubble.data.id, bubble);
    }
  }

  get anyVisibleComment() {
    return this.comments?.length > 0 && this.comments.some((c) => !c.deleted);
  }

  delete(comment: Shikimori.Comment) {
    this._comments.deleteComment(comment.id)
      .subscribe(
        (deleted) => {
          const NOTIFICATION = deleted
            ? new Notification(NotificationType.OK, 'Комментарий удалён')
            : new Notification(NotificationType.WARNING, 'Комментарий не был удалён');

          this.deletedCommentsIds.add(comment.id);
          this._notifications.add(NOTIFICATION);
        },
        (err) => this._notifications.add(new Notification(NotificationType.ERROR, 'Ошибка при удалении комментария', err))
      )
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

  toggleComments() {
    this.commentsHidden = !this.commentsHidden;
  }

  getTail(): number {
    if (this.comments.length <= 21) {
      this.commentsHidden = false;
    }

    return this.commentsHidden && this.comments.length > 21 ? this.comments.length - 21 : 0;
  }

  updateEventListeners() {
    const SPOILERS = this._elementRef.nativeElement.querySelectorAll('.shc-spoiler');
    const IMAGES = this._elementRef.nativeElement.querySelectorAll('.shc-image img');
    const BUBBLED_COMMENTS = this._elementRef.nativeElement.querySelectorAll('a.shc-links.bubbled');

    SPOILERS.forEach((spoiler) => spoiler.onclick = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.toggleSpoiler(spoiler);
    });

    IMAGES.forEach((img) => {
      const PARENT = img.parentElement;

      if (!PARENT.onclick) {
        PARENT.onclick = (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          this.openImg(PARENT.href || img.src);
        };
      }
    });

    BUBBLED_COMMENTS.forEach((reply: HTMLLinkElement) => {
      const HREF = `${reply.href}`;
      const BODY_RECT = document.body.getBoundingClientRect();
      const ELEM_RECT = reply.getBoundingClientRect();
      const COMMENT_ID = HREF.match(/comments/i) && parseInt(HREF.match(/\d+/)[0], 10);

      if (COMMENT_ID) {
        reply.onclick = async (evt) => {
          evt.preventDefault();
          await this.scrollToComment(COMMENT_ID);
        }

        reply.onmouseover = () => {
          clearTimeout(this.bubbledInTimeout);
          this.bubbledInTimeout = setTimeout(async () => {
            const COMMENT = await this._getComment(COMMENT_ID);
            const BUBBLE: Bubble<Shikimori.Comment> = {
              coordinates: {
                x: +ELEM_RECT.left + ELEM_RECT.width + pageXOffset,
                y: +ELEM_RECT.top - BODY_RECT.top
              },
              data: COMMENT,
              hidden: false,
              timeout: null,
              zIndex: 2
            };

            this._showBubble(BUBBLE);
          }, 600);
        }

        reply.onmouseleave = () => {
          clearTimeout(this.bubbledInTimeout);
          clearTimeout(this.bubbledOutTimeout);
          this.bubbledOutTimeout = setTimeout(() => {
            const BUBBLE = this._findBubbleById(COMMENT_ID);

            if (BUBBLE) {
              this.startBubbleDestroyTimeout(BUBBLE);
            }
          }, 200);
        }
      }
    });
  }

  scrollCommentsUntil(id: number, delay = 0): Promise<HTMLElement> {
    const _nextPageUntilComment = (cid, ms, resolve) => setTimeout(() => {
      if (!this.comments.some(v => v.id === id)) {
        this.nextPage.emit();
        _nextPageUntilComment(id, +ms + 255, resolve);
      } else {
        resolve(this._elementRef.nativeElement.querySelector(`#comment-${id}`));
      }
    }, ms);

    return new Promise((resolve) => _nextPageUntilComment(id, delay, resolve));
  }

  async scrollToComment(id: number) {
    const COMMENT = await this.scrollCommentsUntil(id, 0);

    if (COMMENT) {
      COMMENT.scrollIntoView({ behavior: 'smooth' });
      COMMENT.classList.add('flashing-comment');
      setTimeout(() => COMMENT.classList.remove('flashing-comment'), 1100);
    }
  }

  openImg(src: string) {
    document.body.style.overflow = 'hidden';
    this.imgLink = src;
  }

  closeImg() {
    document.body.style.overflow = 'visible';
    this.imgLink = null;
    this.imgBroken = false;
  }

  imgNotLoaded() {
    this.imgBroken = true;
  }

  trackComment(index: number, item: Shikimori.Comment) {
    return item.id;
  }

  stopBubbleDestroyTimeout(bubble: Bubble<Shikimori.Comment>) {
    this.dropInOutTimeouts();
    clearTimeout(bubble.timeout);
    bubble.hidden = false;
  }

  startBubbleDestroyTimeout(bubble: Bubble<Shikimori.Comment>) {
    this.dropInOutTimeouts();
    clearTimeout(bubble.timeout);
    bubble.timeout = setTimeout(() => this.hideBubble(bubble), 500);
  }

  dropInOutTimeouts() {
    clearTimeout(this.bubbledInTimeout);
    clearTimeout(this.bubbledOutTimeout);
  }

  hideBubble(bubble: Bubble<Shikimori.Comment>) {
    bubble.hidden = true;
    bubble.zIndex = 1;
  }

}
