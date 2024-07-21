import { AnimeKindType } from '@app/shared/types/shikimori/anime-kind.type';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export interface AnimeBriefInfoInterface {
    id: number;
    name: string;
    russian: string;
    image: {
        original: string;
        preview: string;
        x96: string;
        x48: string;
    };
    url: string;
    kind: AnimeKindType;
    score: string;
    status: string;
    episodes: number;
    episodes_aired: number;
    aired_on: string;
    released_on: string;
    user_rate: UserAnimeRate;
}
