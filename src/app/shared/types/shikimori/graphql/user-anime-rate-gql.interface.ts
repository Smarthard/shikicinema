import { AnimeGQL } from '@app/shared/types/shikimori/graphql/anime.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

export interface UserAnimeRateGQL {
    anime: AnimeGQL;
    chapters: number;
    createdAt: string;
    episodes: number;
    id: ResourceIdType;
    rewatches: number;
    score: number;
    status: UserRateStatusType;
    text: string;
    updatedAt: string;
    volumes: number;
}
