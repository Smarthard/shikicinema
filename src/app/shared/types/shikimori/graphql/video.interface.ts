import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface VideoGQL {
    id: ResourceIdType;
    imageUrl: string;
    kind: string;
    name: string;
    playerUrl: string;
    url: string;
}
