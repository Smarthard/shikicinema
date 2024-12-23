import { Pipe, PipeTransform } from '@angular/core';
import { VideoInfoInterface } from '@app/modules/player/types';

@Pipe({
    name: 'getEpisodes',
    pure: true,
    standalone: true,
})
export class GetEpisodesPipe implements PipeTransform {
    transform(videos: VideoInfoInterface[]): number[] {
        const episodes = videos?.map(({ episode }) => episode);

        return [...new Set(episodes)].sort((a, b) => a - b);
    }
}
