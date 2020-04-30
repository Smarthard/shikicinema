import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {

  static _insertAtCaret(textearea: HTMLTextAreaElement, before?: string, after?: string) {
    const BEFORE_TEXT = textearea.value.substr(0, textearea.selectionStart);
    const TEXT = before + textearea.value.substr(textearea.selectionStart, textearea.selectionEnd) + after;
    const AFTER_TEXT = textearea.value.substr(textearea.selectionEnd, textearea.value.length);
    textearea.value = BEFORE_TEXT + TEXT + AFTER_TEXT;
  }

  constructor() { }

  ngOnInit(): void {
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

}
