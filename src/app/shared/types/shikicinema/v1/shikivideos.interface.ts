import { ShikivideosKindType } from '@app/shared/types/shikicinema/v1/shikivideos-kind.type';

export interface ShikivideosInterface {
    id: number;
    url: string;
    anime_id: number;
    episode: number;
    kind: ShikivideosKindType;
    language: string;
    quality: string;
    author: string;
    uploader: string;
    watches_count: number;
    anime_english?: string;
    anime_russian?: string;
}
