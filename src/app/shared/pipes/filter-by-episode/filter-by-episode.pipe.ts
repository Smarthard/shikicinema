import { Pipe, PipeTransform } from '@angular/core';

import { VideoInfoInterface } from '@app/modules/player/types';
import { filterByEpisode } from '@app/shared/utils/filter-by-episode.function';

@Pipe({
    name: 'filterByEpisode',
    pure: true,
    standalone: true,
})
export class FilterByEpisodePipe implements PipeTransform {
    transform(videos: VideoInfoInterface[], episode: number): VideoInfoInterface[] {
        return filterByEpisode(videos, episode);
    }
}
