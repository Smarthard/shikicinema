import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { VideoInfoInterface } from '@app/modules/player/types';

@Pipe({
    name: 'filterByAuthor',
    pure: true,
    standalone: true,
})
export class FilterByAuthorPipe implements PipeTransform {
    constructor(private readonly transloco: TranslocoService) {}
    transform(videos: VideoInfoInterface[], targetAuthor: string): VideoInfoInterface[] {
        const defaultAuthor = this.transloco.translate('GLOBAL.VIDEO.AUTHORS.DEFAULT_NAME');

        return videos?.filter(({ author }) => targetAuthor && targetAuthor !== defaultAuthor
            ? author?.includes(targetAuthor)
            : author === defaultAuthor || !author);
    }
}
