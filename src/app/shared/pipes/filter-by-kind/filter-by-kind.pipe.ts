import { Pipe, PipeTransform } from '@angular/core';
import { VideoInfoInterface } from '@app/modules/player/types';

import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';

@Pipe({
    name: 'filterByKind',
    pure: true,
    standalone: true,
})
export class FilterByKindPipe implements PipeTransform {
    transform(videos: VideoInfoInterface[], targetKind: VideoKindEnum): VideoInfoInterface[] {
        return videos?.filter(({ kind }) => kind === targetKind);
    }
}
