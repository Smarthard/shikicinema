import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';

export interface ShikimoriStoreInterface {
    isCurrentUserLoading: boolean;
    currentUser: UserBriefInfoInterface;
}
