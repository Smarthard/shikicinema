import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';
import { UserRateTargetEnum } from '@app/shared/types/shikimori/user-rate-target.enum';

export interface UserBriefRateInterface {
    id: number;
    user_id: number;
    target_id: number;
    target_type: UserRateTargetEnum;
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
