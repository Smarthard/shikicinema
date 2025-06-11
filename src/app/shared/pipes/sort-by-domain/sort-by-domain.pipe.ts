import { Pipe, PipeTransform } from '@angular/core';


import { VideoInfoInterface } from '@app/modules/player/types';
import { getDomain } from '@app/shared/utils/get-domain.function';

@Pipe({
    name: 'sortByDomain',
    pure: true,
    standalone: true,
})
export class SortByDomainPipe implements PipeTransform {
    transform(videos: VideoInfoInterface[]): VideoInfoInterface[] {
        return videos.sort(
            (a, b) => getDomain(a?.url).localeCompare(getDomain(b?.url)),
        );
    }
}
