import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface StudioGQL {
    id: ResourceIdType;
    imageUrl: string;
    name: string;
}
