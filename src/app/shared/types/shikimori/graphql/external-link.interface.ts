import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface ExternalLinkGQL {
    createdAt: string;
    id: ResourceIdType;
    kind: string;
    updatedAt: string;
    url: string;
}
