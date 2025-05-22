import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface VisitedAnimePages {
    // animeId -> episode
    [animeId: ResourceIdType]: {
        episode: ResourceIdType;
        visited: Date;
    };
}
