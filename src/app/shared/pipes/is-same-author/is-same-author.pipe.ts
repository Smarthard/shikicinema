import { Pipe, PipeTransform } from '@angular/core';

import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';

@Pipe({
    name: 'isSameAuthor',
    pure: true,
    standalone: true,
})
export class IsSameAuthorPipe implements PipeTransform {
    transform(a: string, b: string): boolean {
        return cleanAuthorName(a) === cleanAuthorName(b);
    }
}
