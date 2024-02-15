import {
    Actions,
    createEffect,
    ofType,
} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { merge, switchMap } from 'rxjs';

import { ShikicinemaV1ClientService } from '@app/shared/services';
import { addVideosAction, findVideosAction } from '@app/modules/player/store/actions';
import { shikicinemaVideoMapper } from '@app/shared/types/shikicinema/v1';
import { toVideoInfo } from '@app/shared/rxjs';

@Injectable()
export class PlayerEffects {
    findVideos$ = createEffect(() => this.actions$.pipe(
        ofType(findVideosAction),
        switchMap(
            ({ animeId }) => merge(
                this.shikivideos.findAnimes(animeId),
            ).pipe(
                /* accumulating videos into storage */
                toVideoInfo(shikicinemaVideoMapper),
                map((videos) => addVideosAction({ animeId, videos })),
            ),
        ),
    ));

    constructor(
        private actions$: Actions,
        private shikivideos: ShikicinemaV1ClientService,
    ) {}
}
