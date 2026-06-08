import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { SortOrderType } from '@app/shared/types/shikicinema/v1/sort-order.type';

export interface AnimeQueryFiltersInterface {
    genres?: ResourceIdType[];
    studios?: ResourceIdType[];
    kinds?: string[];
    statuses?: string[];
    ageRatings?: string[];
    sort?: string;
    order?: SortOrderType;
}
