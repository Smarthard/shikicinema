import { AnimeKindType } from '@app/shared/types/shikimori/anime-kind.type';
import { PaginationRequest } from '@app/shared/types/shikimori/queries/pagination-request';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

type AnimeOrderType = 'id'
| 'id_desc'
| 'ranked'
| 'kind'
| 'popularity'
|'name'
|'aired_on'
|'episodes'
|'status'
|'created_at'
|'created_at_desc'
|'random';

type AnimeStatusType = 'anons' | 'ongoing' | 'released';

/**
 * @description "S" - less than 10 minutes,
 * "D" - less than 30 minutes,
 * "F" - more than 30 minutes
 */
type AnimeDurationType = 'S' | 'D' | 'F';
type AnimeRatingType = 'none' | 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';

export interface FindAnimeQuery extends PaginationRequest {
    order?: AnimeOrderType;
    kind?: AnimeKindType;
    status?: AnimeStatusType;
    /**
     * @example
     *     - summer_2017
     *     - 2016
     *     - 2014_2016
     *     - 199x
     */
    season?: string;
    score?: number;
    duration?: AnimeDurationType;
    rating?: AnimeRatingType;
    /**
     * @description List of genre ids separated by comma
     */
    genre?: string;
    /**
     * @description List of studio ids separated by comma
     */
    studio?: string;
    /**
     * @description List of franchises separated by comma
     */
    franchise?: string;
    censored?: boolean;
    mylist?: UserRateStatusType;
    /**
     * @description List of anime ids separated by comma
     */
    ids?: string;
    /**
     * @description List of anime ids separated by comma
     */
    exclude_ids?: string;
    search?: string;
}
