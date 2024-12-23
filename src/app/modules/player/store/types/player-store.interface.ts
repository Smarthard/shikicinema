import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { EpisodeCommentsInterface, VideoInfoInterface } from '@app/modules/player/types';

export interface PlayerStoreInterface {
    videos: {
        [animeId: string]: VideoInfoInterface[];
    };
    animeInfo: {
        [animeId: string]: AnimeBriefInfoInterface;
    };
    comments: {
        [animeId: string]: EpisodeCommentsInterface;
    };
}
