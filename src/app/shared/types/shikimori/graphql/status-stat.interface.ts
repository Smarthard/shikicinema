import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

export interface StatusStatGQL {
    count: number;
    status: UserRateStatusType;
}
