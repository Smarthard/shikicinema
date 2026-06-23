import { AnimeKindType, AnimeReleaseStatus } from '@app/shared/types/shikimori';
import { ShikicinemaAnimeTitle } from '@app/shared/types/shikicinema/v1/shikicinema-anime-title.interface';

export interface ShikicinemaAnime {
    id: number;
    tags: string[];
    kind: AnimeKindType;
    rating: string | null;
    score: number | null;
    status: AnimeReleaseStatus;
    duration: number | null;
    aired_on: string | null;
    released_on: string | null;
    next_episode_at: string | null;
    description: string | null;
    episodes: number;
    episodes_aired: number;
    studios: {
        id: number;
        name: string;
        poster?: string;
    }[];
    titles: ShikicinemaAnimeTitle[];
    genres: {
        id: number;
        name: string;
        russian: string;
        kind: string;
    }[];
    created_at: string;
    updated_at: string;
    poster: {
        avif: string;
        webp: string;
        jpeg: string;
        placeholder: string;
    };
}
