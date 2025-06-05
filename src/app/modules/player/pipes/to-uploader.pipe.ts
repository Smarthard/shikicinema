import {
    Observable,
    debounceTime,
    map,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';

import { DELETED_UPLOADER } from '@app/shared/types/well-known-uploader-ids';
import { ShikimoriClient } from '@app/shared/services';
import { UploaderIdType } from '@app/shared/types/uploader-id.type';
import { UploaderInterface } from '@app/modules/player/types';
import { mapUserToUploader } from '@app/shared/utils/map-user-to-uploader.function';
import { selectKnownUploaders } from '@app/store/cache/selectors/cache.selectors';
import { updateUploadersCacheAction } from '@app/store/cache/actions';


@Pipe({
    name: 'toUploader',
    standalone: true,
})
export class ToUploaderPipe implements PipeTransform {
    constructor(
        private readonly shikimori: ShikimoriClient,
        private readonly store: Store,
    ) {}

    transform(uploaderId: UploaderIdType): Observable<UploaderInterface> {
        const uploadersCache$ = this.store.select(selectKnownUploaders);

        return uploadersCache$.pipe(
            map((cache) => cache[uploaderId || DELETED_UPLOADER]),
            debounceTime(500),
            switchMap((cacheHit) => cacheHit
                ? of(cacheHit)
                : this.shikimori.getUser(uploaderId as string).pipe(
                    map(mapUserToUploader),
                    tap((uploader) => this.store.dispatch(updateUploadersCacheAction({ uploaderId, uploader })))),
            ),
        );
    }
}
