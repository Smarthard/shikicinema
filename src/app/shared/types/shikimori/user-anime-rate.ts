import { UserImagesInterface } from '@app/shared/types/shikimori/user-images.interface';
import { AnimeKindType } from '@app/shared/types/shikimori/anime-kind.type';
import { MangaKindType } from '@app/shared/types/shikimori/manga-kind.type';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

type AnimeReleaseStatus = 'anons' | 'ongoing' | 'released';
type MangaReleaseStatus = 'anons' | 'ongoing' | 'released' | 'paused' | 'discontinued';

interface RateUserInfo {
    id: number;
    nickname: string;
    avatar: string;
    image: UserImagesInterface;
    last_online_at: string;
}

interface RateImage {
    original: string;
    preview: string;
    x96: string;
    x48: string;
}

interface Rate<K = string, S = string> {
    id: number;
    name: string;
    russian: string;
    image: RateImage;
    url: string;
    score: string; // like 1.0
    aired_on: string | null;
    released_on: string | null;
    kind: K;
    status: S;
}

interface AnimeRate extends Rate<AnimeKindType, AnimeReleaseStatus> {
    episodes: number;
    episodes_aired: number;
}

interface MangaRate extends Rate<MangaKindType, MangaReleaseStatus> {
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
    user: RateUserInfo;
    anime: T | null;
    manga: T | null;
}

export type UserAnimeRate = UserFullRate<AnimeRate> & { manga: null };
export type UserMangaRate = UserFullRate<MangaRate> & { anime: null };
