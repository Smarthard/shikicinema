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

  addSmiley(textarea: HTMLTextAreaElement, smiley: string) {
    CommentFormComponent._insertAtCursor(textarea, ` ${smiley} `);
    this.resize(textarea);
  }

  bold(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertBeforeAfterCursor(textarea,'[b]', '[/b]');
    this.resize(textarea);
  }

  close() {
    this._closeAllSections();
  }

  image(textarea: HTMLTextAreaElement, form: { imageSrc: string }) {
    if (form.imageSrc) {
      CommentFormComponent._insertAtCursor(textarea, `[img]${form.imageSrc}[/img]`);
      this.resize(textarea);
    }
  }

  italic(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertBeforeAfterCursor(textarea, '[i]', '[/i]');
    this.resize(textarea);
  }

  link(textarea: HTMLTextAreaElement, form: { href: string, name: string }) {
    if (form.href) {
      const LINK_URL = new URL(form.href);

      if (!form.name) {
        form.name = LINK_URL.host;
      }

      CommentFormComponent._insertAtCursor(textarea, `[url=${form.href}]${form.name}[/url]`);
      this.resize(textarea);
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

  addQuote(textarea: HTMLTextAreaElement, form: { nickname: string }) {
    CommentFormComponent._insertAtCursor(textarea, `[quote=${form.nickname}][/quote]`);
    this.resize(textarea);
  }

  resize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    textarea.scrollIntoView({ block: 'end' });
  }

  strike(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertBeforeAfterCursor(textarea, '[s]', '[/s]');
    this.resize(textarea);
  }

  spoiler(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertBeforeAfterCursor(textarea, '[spoiler=спойлер]', '[/spoiler]');
    this.resize(textarea);
  }

  underline(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertBeforeAfterCursor(textarea, '[u]', '[/u]');
    this.resize(textarea);
  }

}
