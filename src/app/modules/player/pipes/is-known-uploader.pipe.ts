import { Inject, Pipe, PipeTransform } from '@angular/core';

import { UploaderIdType } from '@app/shared/types/uploader-id.type';
import { WELL_KNOWN_UPLOADERS_TOKEN } from '@app/shared/types/well-known-uploaders.token';
import { WellKnownType } from '@app/shared/types/well-known-uploaders.type';


@Pipe({
    name: 'isWellKnownUploader',
    standalone: true,
})
export class isWellKnownUploaderPipe implements PipeTransform {
    constructor(
        @Inject(WELL_KNOWN_UPLOADERS_TOKEN)
        private readonly wellkKownUploaders: WellKnownType,
    ) {}

    transform(uploaderId: UploaderIdType): boolean {
        return Boolean(this.wellkKownUploaders?.[uploaderId]);
    }
}
