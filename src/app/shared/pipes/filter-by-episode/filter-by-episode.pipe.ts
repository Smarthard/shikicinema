import { Pipe, PipeTransform } from '@angular/core';
import { VideoInfoInterface } from '@app/modules/player/types';

@Pipe({
    name: 'filterByEpisode',
    pure: true,
    standalone: true,
})
export class FilterByEpisodePipe implements PipeTransform {
    transform(videos: VideoInfoInterface[], episode: number): VideoInfoInterface[] {
        return videos?.filter(({ episode: videoEpisode }) => videoEpisode === episode);
    }
}
