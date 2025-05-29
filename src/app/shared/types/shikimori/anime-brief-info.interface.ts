import { AnimeKindType } from '@app/shared/types/shikimori/anime-kind.type';
import { AnimeReleaseStatus, UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export interface AnimeBriefInfoInterface {
    id: number;

    /** название (ромадзи)*/
    name: string;

    /** перевод названия на русском */
    russian: string;

    /** перевод названия на английском */
    english: string[];

    /** название в оригинале (японский/китайский/корейский) */
    japanese: string[];

    /** другие названия или сокращения их (сортировка по популярности) */
    synonyms: string[];

    image: {
        original: string;
        preview: string;
        x96: string;
        x48: string;
    };
    url: string;
    kind: AnimeKindType;
    score: string;
    status: AnimeReleaseStatus;
    episodes: number;
    episodes_aired: number;
    aired_on: string;
    released_on: string;
    user_rate: UserAnimeRate;
}
