import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Shikimori} from '../../../types/shikimori';
import {CommentsService} from '../../../services/comments/comments.service';
import {NotificationsService} from '../../../services/notifications/notifications.service';
import {Notification, NotificationType} from '../../../types/notification';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit, OnChanges {

  @Input()
  anime: Shikimori.Anime;

  @Input()
  commentator: Shikimori.User;

  @Input()
  episode: number;

  @Input()
  users: string[];

  @Input()
  quote: string;

  @Input()
  reply: string;

  @Input()
  topic: Shikimori.ITopic;

  @ViewChild('userComment', { static: true })
  _textareaRef: ElementRef<HTMLTextAreaElement>;

  bbComment: string;

  addLinkForm: FormGroup;
  addImageForm: FormGroup;
  addQuotesForm: FormGroup;
  commentForm: FormGroup;

  isImageSectionOpen = false;
  isLinkSectionOpen = false;
  isShowPreview = true;
  isQuotesSectionOpen = false;
  isSmileysSectionOpen = false;

  static _insertBeforeAfterCursor(textarea: HTMLTextAreaElement, before = '', after = '') {
    if (!textarea.disabled) {
      let newCursorPosition = +textarea.selectionStart + before.length + after.length;

      if (textarea.selectionStart || textarea.selectionStart === 0) {
        const BEFORE_TEXT = textarea.value.substring(0, textarea.selectionStart);
        const TEXT = before + textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) + after;
        const AFTER_TEXT = textarea.value.substring(textarea.selectionEnd, textarea.value.length);

        newCursorPosition = +textarea.selectionStart + TEXT.length;
        textarea.value = BEFORE_TEXT + TEXT + AFTER_TEXT;
      } else {
        textarea.value += before + after;
      }

      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  }

  static _insertAtCursor(textarea: HTMLTextAreaElement, text: string) {
    if (!textarea.disabled) {
      const NEW_CURSOR_POSITION = +textarea.selectionStart + text.length;

      if (textarea.selectionStart || textarea.selectionStart === 0) {
        const BEFORE_TEXT = textarea.value.substring(0, textarea.selectionStart);
        const AFTER_TEXT = textarea.value.substring(textarea.selectionEnd, textarea.value.length);

        textarea.value = BEFORE_TEXT + text + AFTER_TEXT;
      } else {
        textarea.value += text;
      }

      textarea.setSelectionRange(NEW_CURSOR_POSITION, NEW_CURSOR_POSITION);
    }
  }

  constructor(
    private commentsService: CommentsService,
    private notifications: NotificationsService
  ) { }

  private _closeAllSections() {
    this.isImageSectionOpen = false;
    this.isLinkSectionOpen = false;
    this.isQuotesSectionOpen = false;
    this.isSmileysSectionOpen = false;
  }

  ngOnInit(): void {
   this.addLinkForm = new FormGroup({
     href: new FormControl('', [
       Validators.required,
       Validators.pattern(/https?:\/\/.*/i)
     ]),
     name: new FormControl()
   });

   this.addImageForm = new FormGroup({
     imageSrc: new FormControl('', [
       Validators.required,
       Validators.pattern(/https?:\/\/.*/i)
     ])
   });

   this.addQuotesForm = new FormGroup({
     nickname: new FormControl('', [
       Validators.required,
       Validators.minLength(1)
     ])
   });

   this.commentForm = new FormGroup({
     comment: new FormControl(this._textareaRef.nativeElement.value, [
       Validators.required,
       Validators.minLength(1)
     ])
   });

    if (this.commentator && this.commentator.id) {
      this.commentForm.controls.comment.setValue('');
      this.commentForm.enable();
    } else {
      this.commentForm.controls.comment.setValue('Для комментирования необходимо авторизоваться');
      this.commentForm.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.reply?.currentValue && this?._textareaRef) {
      CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, this.reply);
      this.updateCommentForm();
    }

    if (changes?.quote?.currentValue && this?._textareaRef) {
      CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, this.quote);
      this.updateCommentForm();
    }
  }

  addSmiley(smiley: string) {
    CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, ` ${smiley} `);
    this.updateCommentForm();
  }

  bold() {
    CommentFormComponent._insertBeforeAfterCursor(this._textareaRef.nativeElement,'[b]', '[/b]');
    this.updateCommentForm();
  }

  close() {
    this._closeAllSections();
  }

  image(form: { imageSrc: string }) {
    if (form.imageSrc) {
      CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, `[img]${form.imageSrc}[/img]`);
      this.updateCommentForm();
    }
  }

  italic() {
    CommentFormComponent._insertBeforeAfterCursor(this._textareaRef.nativeElement, '[i]', '[/i]');
    this.updateCommentForm();
  }

  link(form: { href: string, name: string }) {
    if (form.href) {
      const LINK_URL = new URL(form.href);

      if (!form.name) {
        form.name = LINK_URL.host;
      }

      CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, `[url=${form.href}]${form.name}[/url]`);
      this.updateCommentForm();
    }
  }

  openLinkSection() {
    this._closeAllSections();
    this.isLinkSectionOpen = true;
  }

  openImageSection() {
    this._closeAllSections();
    this.isImageSectionOpen = true;
  }

  openQuotesSection() {
    this._closeAllSections();
    this.isQuotesSectionOpen = true;
  }

  openSmileys() {
    this._closeAllSections();
    this.isSmileysSectionOpen = true;
  }

  addQuote(form: { nickname: string }) {
    CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, `[quote=${form.nickname}][/quote]`);
    this.updateCommentForm();
  }

  updateCommentForm() {
    this._textareaRef.nativeElement.style.height = 'auto';
    this._textareaRef.nativeElement.style.height = `${this._textareaRef.nativeElement.scrollHeight}px`;
    this.bbComment = this._textareaRef.nativeElement.value;
    this.commentForm.controls.comment.setValue(this.bbComment);
  }

  strike() {
    CommentFormComponent._insertBeforeAfterCursor(this._textareaRef.nativeElement, '[s]', '[/s]');
    this.updateCommentForm();
  }

  spoiler() {
    CommentFormComponent._insertBeforeAfterCursor(this._textareaRef.nativeElement, '[spoiler=спойлер]', '[/spoiler]');
    this.updateCommentForm();
  }

  comment(bbcode: string) {
    const COMMENT = bbcode || '[i]Здесь стоит что-нибудь написать...[/i]';
    const PARSED_COMMENT = this.commentsService.parseBBComment(COMMENT);

    return new Shikimori.Comment(
      -1000,
      this.topic?.id || null,
      'Topic',
      COMMENT,
      PARSED_COMMENT,
      new Date(),
      new Date(),
      false,
      false,
      true,
      this.commentator
    );
  }

  onCommentSubmit() {
    const FORM = this.commentForm.value;
    const ANIME = this.anime;
    const EPISODE = this.episode;
    const COMMENT: Shikimori.Comment = new Shikimori.Comment(
      null,
      this.topic?.id || null,
      'Topic',
      FORM.comment,
      null,
      new Date(),
      new Date(),
      false,
      false,
      true,
      this.commentator
    );

    this.commentsService.createComment(ANIME, EPISODE, COMMENT)
      .subscribe(
        () => {
          this.commentForm.controls.comment.reset();
          this.commentForm.markAsUntouched();
          this.notifications.add(new Notification(NotificationType.OK, 'Комментарий отправлен'))
        },
        (err) => this.notifications.add(new Notification(NotificationType.WARNING, err.message))
      );
  }

  togglePreview() {
    this.isShowPreview = !this.isShowPreview;
  }

  underline() {
    CommentFormComponent._insertBeforeAfterCursor(this._textareaRef.nativeElement, '[u]', '[/u]');
    this.updateCommentForm();
  }

}
