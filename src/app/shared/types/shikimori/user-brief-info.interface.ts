import { UserImagesInterface } from '@app/shared/types/shikimori/user-images.interface';

export interface UserBriefInfoInterface {
    id: number;
    nickname: string;
    avatar: string;
    image: UserImagesInterface;
    last_online_at: string;
    url: string;
    name: string | null;
    sex: 'male' | 'female' | null;
    full_years: number | null;
    website: string;
    birth_on: string | null;
    locale: string;
}
