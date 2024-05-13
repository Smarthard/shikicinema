import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'LinkReplace'
})
export class LinkReplacePipe implements PipeTransform {
  transform(url: string): string {
    return url.replace('/x96/', '/original/');
  }
}
