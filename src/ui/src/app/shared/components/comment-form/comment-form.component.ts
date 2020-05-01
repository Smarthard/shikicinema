import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {

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
    this.isSmileysSectionOpen = false;
  }

  ngOnInit(): void {
  }

  addSmiley(textarea: HTMLTextAreaElement, smiley: string) {
    CommentFormComponent._insertAtCursor(textarea, ` ${smiley} `);
  }

  bold(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertBeforeAfterCursor(textarea,'[b]', '[/b]');
  }

  italic(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertBeforeAfterCursor(textarea, '[i]', '[/i]')
  }

  underline(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertBeforeAfterCursor(textarea, '[u]', '[/u]')
  }

  strike(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertBeforeAfterCursor(textarea, '[s]', '[/s]')
  }

  spoiler(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertBeforeAfterCursor(textarea, '[spoiler=спойлер]', '[/spoiler]')
  }

  openSmileys() {
    this._closeAllSections();
    this.isSmileysSectionOpen = true;
  }

  close() {
    this._closeAllSections();
  }

}
