import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface ShikicinemaStudio {
    id: ResourceIdType;
    name: string;
    poster: string | null;
}
