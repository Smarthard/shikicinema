import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';

export interface ShikimoriStoreInterface {
    isCurrentUserLoading: boolean;
    currentUser: UserBriefInfoInterface;

    isAnimeSearchLoading: boolean;
    foundAnimes: AnimeBriefInfoInterface[] | null;

    errors: unknown;
}
