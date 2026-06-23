import { ShikicinemaAnime } from '@app/shared/types/shikicinema/v1';

export interface AnimeCacheEntity {
    anime: ShikicinemaAnime;
    ttl: string;
};
