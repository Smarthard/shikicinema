import { UploaderIdType } from '@app/shared/types/uploader-id.type';

export interface UploaderInterface {
    id: UploaderIdType;
    name: string;
    avatar: string;
    url?: string;
}
