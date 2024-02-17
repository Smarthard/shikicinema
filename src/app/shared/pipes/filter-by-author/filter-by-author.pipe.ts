import { Pipe, PipeTransform } from '@angular/core';
import { VideoInfoInterface } from '@app/modules/player/types';

@Pipe({
    name: 'filterByAuthor',
    pure: true,
    standalone: true,
})
export class FilterByAuthorPipe implements PipeTransform {
    transform(videos: VideoInfoInterface[], targetAuthor: string): VideoInfoInterface[] {
        return videos?.filter(({ author }) => targetAuthor
            ? author?.includes(targetAuthor)
            : author === null);
    }
}
