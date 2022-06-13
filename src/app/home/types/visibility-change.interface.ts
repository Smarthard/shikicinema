import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

export interface VisibilityChangeInterface {
    section: UserRateStatusType;
    isVisible: boolean;
}
