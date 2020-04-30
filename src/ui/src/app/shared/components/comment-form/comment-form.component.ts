import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {

  isSmileysSectionOpen = false;

  static _insertAtCaret(textarea: HTMLTextAreaElement, before?: string, after?: string) {
    if (textarea.selectionStart || textarea.selectionStart === 0) {
      const BEFORE_TEXT = textarea.value.substr(0, textarea.selectionStart);
      const TEXT = before + textarea.value.substr(textarea.selectionStart, textarea.selectionEnd) + after;
      const AFTER_TEXT = textarea.value.substr(textarea.selectionEnd, textarea.value.length);
      textarea.value = BEFORE_TEXT + TEXT + AFTER_TEXT;
    } else {
      textarea.value += before + after;
    }
  }

  static _insertAtCursor(textarea: HTMLTextAreaElement, text: string) {
    if (textarea.selectionStart || textarea.selectionStart === 0) {
      const BEFORE_TEXT = textarea.value.substr(0, textarea.selectionStart);
      const AFTER_TEXT = textarea.value.substr(textarea.selectionEnd, textarea.value.length);

      textarea.value = BEFORE_TEXT + text + AFTER_TEXT;
    } else {
      textarea.value += text;
    }
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
    CommentFormComponent._insertAtCaret(textarea,'[b]', '[/b]');
  }

  italic(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertAtCaret(textarea, '[i]', '[/i]')
  }

  underline(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertAtCaret(textarea, '[u]', '[/u]')
  }

  strike(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertAtCaret(textarea, '[s]', '[/s]')
  }

  spoiler(textarea: HTMLTextAreaElement) {
    CommentFormComponent._insertAtCaret(textarea, '[spoiler=спойлер]', '[/spoiler]')
  }

  openSmileys() {
    this._closeAllSections();
    this.isSmileysSectionOpen = true;
  }

}
