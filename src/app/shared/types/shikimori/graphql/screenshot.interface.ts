import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface ScreenshotGQL {
    id: ResourceIdType;
    originalUrl: string;
    x166Url: string;
    x332Url: string;
}
