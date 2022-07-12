import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

type RateTargetType = 'Anime' | 'Manga';

export interface UserBriefRateInterface {
    id: number;
    user_id: number;
    target_id: number;
    target_type: RateTargetType;
    score: number;
    status: UserRateStatusType;
    rewatches: number;
    episodes: number;
    volumes: number;
    chapters: number;
    text: string;
    text_html: string;
    created_at: string;
    updated_at: string;
}
