import { Pipe, PipeTransform } from '@angular/core';

import { GetUrlDomainPipe } from '@app/shared/pipes/get-url-domain/get-url-domain.pipe';
import { VideoInfoInterface } from '@app/modules/player/types';

@Pipe({
    name: 'sortByDomain',
    pure: true,
    standalone: true,
})
export class SortByDomainPipe implements PipeTransform {
    constructor(private readonly domainPipe: GetUrlDomainPipe) {}

    private getDomain(video: VideoInfoInterface): string {
        return this.domainPipe.transform(video.url);
    }

    transform(videos: VideoInfoInterface[]): VideoInfoInterface[] {
        return videos.sort(
            (a, b) => this.getDomain(a).localeCompare(this.getDomain(b)),
        );
    }
}
