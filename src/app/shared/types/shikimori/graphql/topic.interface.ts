import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface TopicGQL {
    body: string;
    commentsCount: number;
    createdAt: string;
    htmlBody: string;
    id: ResourceIdType;
    tags: string[];
    title: string;
    type: string;
    updatedAt: string;
    url: string;
}
