import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface RecentAnimePages {
    [animeId: ResourceIdType]: {
        episode: number;
        // ISO-string Date
        visited: string;
    };
}
