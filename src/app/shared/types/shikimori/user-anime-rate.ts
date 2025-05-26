import { AnimeKindType } from '@app/shared/types/shikimori/anime-kind.type';
import { MangaKindType } from '@app/shared/types/shikimori/manga-kind.type';
import { UserImagesInterface } from '@app/shared/types/shikimori/user-images.interface';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

export type AnimeReleaseStatus = 'anons' | 'ongoing' | 'released';
export type MangaReleaseStatus = 'anons' | 'ongoing' | 'released' | 'paused' | 'discontinued';

export interface RateUserInfo {
    id: number;
    nickname: string;
    avatar: string;
    image: UserImagesInterface;
    last_online_at: string;
}

export interface RateImage {
    original: string;
    preview: string;
    x96: string;
    x48: string;
}

export interface Rate<K = string, S = string> {
    id: number;
    name: string;
    russian: string;
    image: RateImage;
    url: string;
    /* score: 1.0 */
    score: string;
    aired_on: string | null;
    released_on: string | null;
    kind: K;
    status: S;
}

export interface AnimeRate extends Rate<AnimeKindType, AnimeReleaseStatus> {
    episodes: number;
    episodes_aired: number;

    // для совместимости с полями названий аниме в AnimeBriefInfoInterface
    japanese: never;
    english: never;
}

export interface MangaRate extends Rate<MangaKindType, MangaReleaseStatus> {
    volumes: number;
    chapters: number;
}

interface UserFullRate<T> {
    id: number;
    score: number;
    status: UserRateStatusType;
    text: string | null;
    episodes: number | null;
    chapters: number | null;
    volumes: number | null;
    text_html: string | null;
    rewatches: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    target_id: number;
    target_type: 'Anime' | 'Manga';
    anime: T;
    manga: T;
}

export type UserAnimeRate = Omit<UserFullRate<AnimeRate>, 'manga'>;
export type UserMangaRate = Omit<UserFullRate<MangaRate>, 'anime'>;
