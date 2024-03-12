import { Pipe, PipeTransform } from '@angular/core';
import { VideoInfoInterface } from '@app/modules/player/types';

import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';

@Pipe({
    name: 'getActiveKinds',
    pure: true,
    standalone: true,
})
export class GetActiveKindsPipe implements PipeTransform {
    transform(videos: VideoInfoInterface[]): VideoKindEnum[] {
        const kinds = videos?.map(({ kind }) => kind);

        return [...new Set(kinds)];
    }
}
