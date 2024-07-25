import {
    EMPTY,
    Observable,
    map,
    of,
} from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

import { KODIK_UPLOADER } from '@app/shared/types/kodik';
import { ShikimoriClient } from '@app/shared/services';
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

    transform(uploaderId: string | symbol): Observable<UploaderInterface> {
        if (typeof uploaderId === 'symbol') {
            return of({
                id: KODIK_UPLOADER,
                name: 'kodik',
                avatar: '/assets/kodik.png',
                url: 'mailto:support@kodik.biz',
            });
        }

        return uploaderId
            ? this.shikimori.getUser(uploaderId).pipe(map(mapUserToUploader))
            : EMPTY;
    }
}
