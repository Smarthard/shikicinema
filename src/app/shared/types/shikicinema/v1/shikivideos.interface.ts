import { AnimeKindType } from '@app/shared/types/shikimori/anime-kind.type';

export interface ShikivideosInterface {
    id: number;
    url: string;
    anime_id: number;
    episode: number;
    kind: AnimeKindType;
    language: string;
    quality: string;
    author: string;
    uploader: string;
    watches_count: number;
    anime_english?: string;
    anime_russian?: string;
}
