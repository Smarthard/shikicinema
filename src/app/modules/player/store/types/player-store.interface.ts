import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { EpisodeCommentsInterface, VideoInfoInterface } from '@app/modules/player/types';
import { ResourceIdType } from '@app/shared/types';
import { ShikimoriFranchise } from '@app/shared/types/shikimori';
import { SourceLoadingStatusInterface } from '@app/modules/player/store/types/sources-loading-status.type';

export interface PlayerStoreInterface {
    currentAnimeId?: ResourceIdType;
    currentEpisode?: number;
    sources: {
        [animeId: ResourceIdType]: SourceLoadingStatusInterface;
    }
    videos: {
        [animeId: ResourceIdType]: VideoInfoInterface[];
    };
    animeInfo: {
        [animeId: ResourceIdType]: AnimeBriefInfoInterface;
    };
    comments: {
        [animeId: ResourceIdType]: EpisodeCommentsInterface;
    };
    franchise: {
        [animeId: ResourceIdType]: ShikimoriFranchise[];
    };
}
