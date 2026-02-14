import { VideoInfoInterface } from '@app/modules/player/types';
import { byDesc } from '@app/shared/utils/sort-by-desc.function';

export function getMaxEpisodeFromVideos(videos: VideoInfoInterface[]): number {
    const episodes = [
        ...new Set(videos.map(({ episode }) => episode)),
    ].sort(byDesc);

    return episodes.length > 0
        ? episodes.at(0)
        : -1;
}
