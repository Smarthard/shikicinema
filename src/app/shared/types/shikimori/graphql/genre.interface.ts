import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { UserRateTargetEnum } from '@app/shared/types/shikimori/user-rate-target.enum';

export interface GenreGQL {
    entryType: UserRateTargetEnum;
    id: ResourceIdType;
    kind: string;
    name: string;
    russian: string;
}
