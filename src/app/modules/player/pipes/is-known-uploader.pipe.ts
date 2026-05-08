import { Pipe, PipeTransform } from '@angular/core';

import { UploaderIdType } from '@app/shared/types/uploader-id.type';
import { isWellKnownUploader } from '@app/modules/player/utils';

@Pipe({
    name: 'isWellKnownUploader',
    standalone: true,
})
export class isWellKnownUploaderPipe implements PipeTransform {
    transform(uploaderId: UploaderIdType): boolean {
        return isWellKnownUploader(uploaderId);
    }
}
