import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { EpisodeCommentsInterface, VideoInfoInterface } from '@app/modules/player/types';
import { ResourceIdType } from '@app/shared/types';
import { ShikimoriFranchise } from '@app/shared/types/shikimori';

export interface PlayerStoreInterface {
    currentAnimeId?: ResourceIdType;
    currentEpisode?: number;
    videos: {
        [animeId: string]: VideoInfoInterface[];
    };
    animeInfo: {
        [animeId: string]: AnimeBriefInfoInterface;
    };
    comments: {
        [animeId: string]: EpisodeCommentsInterface;
    };
    franchise: {
        [animeId: string]: ShikimoriFranchise[];
    }
}
