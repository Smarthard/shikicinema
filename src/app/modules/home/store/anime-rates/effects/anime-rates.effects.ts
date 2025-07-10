import {
    Actions,
    createEffect,
    ofType,
} from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    catchError,
    concatMap,
    delay,
    exhaustMap,
    map,
    switchMap,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { UserRateTargetEnum } from '@app/shared/types/shikimori';
import { concatLatestFrom } from '@ngrx/operators';
import {
    getAnimeRatesMetadataAction,
    getAnimeRatesMetadataFailureAction,
    getAnimeRatesMetadataSuccessAction,
    loadAllUserAnimeRatesAction,
    loadAllUserAnimeRatesFailureAction,
    loadAllUserAnimeRatesSuccessAction,
} from '@app/modules/home/store/anime-rates/actions';
import { selectRatesMetadata } from '@app/modules/home/store/anime-rates/selectors';
import { splitArrayToChunks } from '@app/shared/utils/split-array-to-chunks.funtion';

@Injectable()
export class AnimeRatesEffects {
    private readonly actions$ = inject(Actions);
    private readonly store = inject(Store);
    private readonly shikimori = inject(ShikimoriClient);

    readonly METADATA_QUERY_LIMIT = 50;
    readonly metadata$ = this.store.select(selectRatesMetadata);

    loadAllUserAnimeRates$ = createEffect(() => this.actions$.pipe(
        ofType(loadAllUserAnimeRatesAction),
        exhaustMap(({ userId }) => this.shikimori.getUserRates(userId, UserRateTargetEnum.ANIME).pipe(
            map((rates) => loadAllUserAnimeRatesSuccessAction({ userId, rates })),
            catchError((errors) => of(loadAllUserAnimeRatesFailureAction({ errors }))),
        )),
    ));

    generateMetadataActions$ = createEffect(() => this.actions$.pipe(
        ofType(loadAllUserAnimeRatesSuccessAction),
        map(({ rates }) => rates?.map(({ target_id: targetId }) => targetId)),
        concatLatestFrom(() => this.metadata$),
        map(([animeIds, metadata]) => animeIds?.filter((animeId) => !metadata?.[animeId])),
        map((animeIds) => splitArrayToChunks(animeIds, this.METADATA_QUERY_LIMIT)),
        switchMap((chuckedIds) => chuckedIds.map((animeIds) => getAnimeRatesMetadataAction({ animeIds }))),
    ));

    loadMetadata$ = createEffect(() => this.actions$.pipe(
        ofType(getAnimeRatesMetadataAction),
        delay(333),
        concatMap(({ animeIds }) => this.shikimori.getUserAnimeRatesMetadataGQL(animeIds).pipe(
            map((metadata) => getAnimeRatesMetadataSuccessAction({ metadata })),
            catchError((errors) => of(getAnimeRatesMetadataFailureAction({ errors }))),
        )),
    ));
}
