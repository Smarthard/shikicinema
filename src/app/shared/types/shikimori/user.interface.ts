import { UserImagesInterface } from '@app/shared/types/shikimori/user-images.interface';
import { UserStatsInterface } from '@app/shared/types/shikimori/user-stats.interface';

export interface UserInterface {
    id: number;
    nickname: string;
    avatar: string;
    image: UserImagesInterface;
    last_online_at: string;
    url: string;
    name: string | null;
    sex: 'male' | 'female' | null;
    full_years: number | null;
    last_online: string;
    website: string;
    location: string | null;
    banned: boolean;
    about: string;
    about_html: string;
    /**
     * @description [0] - sex, [1] - age, [2] - website, [3] - register date
     */
    common_info: string[];
    show_comments: boolean;
    in_friends: boolean;
    is_ignored: boolean;
    stats: UserStatsInterface;
    style_id: number;
}
