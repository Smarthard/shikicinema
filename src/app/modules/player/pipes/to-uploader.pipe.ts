import {
    Observable,
    debounceTime,
    map,
    of,
    switchMap,
    tap,
    withLatestFrom,
} from 'rxjs';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { DELETED_UPLOADER } from '@app/shared/types/well-known-uploader-ids';
import { ShikicinemaV1Client, ShikimoriClient } from '@app/shared/services';
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
    private readonly shikimori = inject(ShikimoriClient);
    private readonly shikicinema = inject(ShikicinemaV1Client);
    private readonly store = inject(Store);

    transform(uploaderId: UploaderIdType = DELETED_UPLOADER): Observable<UploaderInterface> {
        const uploadersCache$ = this.store.select(selectKnownUploaders);

        return uploadersCache$.pipe(
            map((cache) => cache[uploaderId]),
            debounceTime(500),
            switchMap((cacheHit) => cacheHit
                ? of(cacheHit)
                : this.shikimori.getUser(uploaderId as string).pipe(
                    withLatestFrom(this.shikicinema.getTotalContributions(uploaderId as string)),
                    map(([user, count]) => mapUserToUploader(user, count)),
                    tap((uploader) => this.store.dispatch(updateUploadersCacheAction({ uploaderId, uploader }))),
                ),
            ),
        );
    }
}
