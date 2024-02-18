import { VideoInfoInterface } from '@app/modules/player/types';

export function filterByEpisode(videos: VideoInfoInterface[], episode: number): VideoInfoInterface[] {
    return videos?.filter(({ episode: videoEpisode }) => videoEpisode === episode);
}
