import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit, OnChanges {

  @Input()
  users: string[];

  @Input()
  quote: string;

  @Input()
  reply: string;

  @ViewChild('userComment', { static: true })
  _textareaRef: ElementRef<HTMLTextAreaElement>;

  addLinkForm: FormGroup;
  addImageForm: FormGroup;
  addQuotesForm: FormGroup;

  isImageSectionOpen = false;
  isLinkSectionOpen = false;
  isQuotesSectionOpen = false;
  isSmileysSectionOpen = false;

  static _insertBeforeAfterCursor(textarea: HTMLTextAreaElement, before = '', after = '') {
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

  static _insertAtCursor(textarea: HTMLTextAreaElement, text: string) {
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

  constructor() { }

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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.reply?.currentValue) {
      CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, this.reply);
    }

    if (changes?.quote?.currentValue) {
      CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, this.quote);
    }
  }

  addSmiley(smiley: string) {
    CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, ` ${smiley} `);
    this.resize();
  }

  bold() {
    CommentFormComponent._insertBeforeAfterCursor(this._textareaRef.nativeElement,'[b]', '[/b]');
    this.resize();
  }

  close() {
    this._closeAllSections();
  }

  image(form: { imageSrc: string }) {
    if (form.imageSrc) {
      CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, `[img]${form.imageSrc}[/img]`);
      this.resize();
    }
  }

  italic() {
    CommentFormComponent._insertBeforeAfterCursor(this._textareaRef.nativeElement, '[i]', '[/i]');
    this.resize();
  }

  link(form: { href: string, name: string }) {
    if (form.href) {
      const LINK_URL = new URL(form.href);

      if (!form.name) {
        form.name = LINK_URL.host;
      }

      CommentFormComponent._insertAtCursor(this._textareaRef.nativeElement, `[url=${form.href}]${form.name}[/url]`);
      this.resize();
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
    this.resize();
  }

  resize() {
    this._textareaRef.nativeElement.style.height = 'auto';
    this._textareaRef.nativeElement.style.height = `${this._textareaRef.nativeElement.scrollHeight}px`;
    this._textareaRef.nativeElement.scrollIntoView({ block: 'end' });
  }

  strike() {
    CommentFormComponent._insertBeforeAfterCursor(this._textareaRef.nativeElement, '[s]', '[/s]');
    this.resize();
  }

  spoiler() {
    CommentFormComponent._insertBeforeAfterCursor(this._textareaRef.nativeElement, '[spoiler=спойлер]', '[/spoiler]');
    this.resize();
  }

  underline() {
    CommentFormComponent._insertBeforeAfterCursor(this._textareaRef.nativeElement, '[u]', '[/u]');
    this.resize();
  }

}
