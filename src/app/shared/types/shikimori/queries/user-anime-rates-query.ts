import { PaginationRequest } from '@app/shared/types/shikimori/queries/pagination-request';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

export interface UserAnimeRatesQuery extends PaginationRequest {
    status?: UserRateStatusType;
    censored?: boolean;
}
