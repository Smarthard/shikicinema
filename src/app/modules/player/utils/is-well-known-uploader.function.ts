import { DELETED_UPLOADER, UploaderIdType } from '@app/shared/types';
import { WELL_KNOWN_UPLOADERS_MAP } from '@app/shared/config/well-known-uploaders.config'

export function isWellKnownUploader(uploaderId: UploaderIdType = DELETED_UPLOADER) {
    const uploader = WELL_KNOWN_UPLOADERS_MAP[uploaderId];

    return Boolean(uploader)
}
