import { Pipe, PipeTransform } from '@angular/core';

import { VideoInfoInterface, VideoQualityEnum } from '@app/modules/player/types';


@Pipe({
    name: 'hasQualities',
    standalone: true,
})
export class HasQualitiesPipe implements PipeTransform {
    transform(videos: VideoInfoInterface[], ...qualities: VideoQualityEnum[]): boolean {
        return videos.some(({ quality }) => qualities.includes(quality));
    }
}
