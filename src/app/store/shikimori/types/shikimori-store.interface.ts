import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';
import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';

export interface ShikimoriStoreInterface {
    isCurrentUserLoading: boolean;
    currentUser: UserBriefInfoInterface;

    isAnimeSearchLoading: boolean;
    foundAnimes: AnimeBriefInfoInterface[] | null;

    errors: any;
}
