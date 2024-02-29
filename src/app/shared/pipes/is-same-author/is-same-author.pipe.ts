import { Pipe, PipeTransform } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';
import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';

@Pipe({
    name: 'isSameAuthor',
    pure: true,
    standalone: true,
})
export class IsSameAuthorPipe implements PipeTransform {
    constructor(private readonly transloco: TranslocoService) {}
    transform(a: string, b: string): boolean {
        const defaultAuthor = this.transloco.translate('GLOBAL.VIDEO.AUTHORS.DEFAULT_NAME');

        return cleanAuthorName(a, defaultAuthor) === cleanAuthorName(b, defaultAuthor);
    }
}
