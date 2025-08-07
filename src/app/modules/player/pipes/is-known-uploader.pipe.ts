import { Pipe, PipeTransform, inject } from '@angular/core';

import { UploaderIdType } from '@app/shared/types/uploader-id.type';
import { WELL_KNOWN_UPLOADERS_TOKEN } from '@app/shared/types/well-known-uploaders.token';


@Pipe({
    name: 'isWellKnownUploader',
    standalone: true,
})
export class isWellKnownUploaderPipe implements PipeTransform {
    private readonly wellkKownUploaders = inject(WELL_KNOWN_UPLOADERS_TOKEN);

    transform(uploaderId: UploaderIdType): boolean {
        return Boolean(this.wellkKownUploaders?.[uploaderId]);
    }
}
