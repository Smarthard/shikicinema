import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeValue} from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, ...args: unknown[]): string | SafeValue {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
