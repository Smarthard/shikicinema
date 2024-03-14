import { EMPTY, Observable, map } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

import { ShikimoriClient } from '@app-root/app/shared/services';
import { UploaderInterface } from '@app/modules/player/types';
import { mapUserToUploader } from '@app/shared/utils/map-user-to-uploader.function';


@Pipe({
    name: 'toUploader',
    standalone: true,
})
export class ToUploaderPipe implements PipeTransform {
    constructor(
        private readonly shikimori: ShikimoriClient,
    ) {}

    transform(uploaderId: string): Observable<UploaderInterface> {
        return uploaderId
            ? this.shikimori.getUser(uploaderId).pipe(map(mapUserToUploader))
            : EMPTY;
    }
}
