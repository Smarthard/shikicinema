import { UploaderIdType } from '@app/shared/types/uploader-id.type';
import { UploaderInterface } from '@app/modules/player/types';

export type WellKnownType = {
    [uploaderId in UploaderIdType]: UploaderInterface;
};
