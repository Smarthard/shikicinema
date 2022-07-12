import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

interface StatusInterface<T> {
    anime: T[];
    manga: T[];
}

interface StatStatusInterface {
    id: number;
    grouped_id: UserRateStatusType;
    name: UserRateStatusType;
    size: number;
    type: 'Anime' | 'Manga';
}

type ScoreNameType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type RatingNameType = 'G' | 'PG' | 'PG-13' | 'R-17' | 'R+' | 'Rx';

interface NameValuePairInterface<T> {
    name: T;
    value: number;
}

export interface UserStatsInterface {
    statuses: StatusInterface<StatStatusInterface>;
    full_statuses: StatusInterface<StatStatusInterface>;
    scores: StatusInterface<NameValuePairInterface<ScoreNameType>>;
    types: StatusInterface<NameValuePairInterface<string>>;
    ratings: StatusInterface<NameValuePairInterface<RatingNameType>>;
    genres: [];
    studios: [];
    publishers: [];
    activity: StatusInterface<NameValuePairInterface<[number, number]>>;
    'has_anime?': boolean;
    'has_manga?': boolean;
}
