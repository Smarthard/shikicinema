import { Pipe, PipeTransform } from '@angular/core';

import { VideoInfoInterface } from '@app/modules/player/types';
import { authorAvailability } from '@app/modules/player/utils';


@Pipe({
    name: 'authorAvailabilityWarning',
    standalone: true,
    pure: false,
})
export class AuthorAvailabilityWarningPipe implements PipeTransform {
    transform(videos: VideoInfoInterface[], lastAiredEpisode: number): string[] {
        return authorAvailability(videos, lastAiredEpisode);
    }
}
