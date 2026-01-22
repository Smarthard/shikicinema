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
    retry,
    switchMap,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { ExtendedUserRateStatusType } from '@app/modules/home/types';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { UserRateTargetEnum } from '@app/shared/types/shikimori';
import { concatLatestFrom } from '@ngrx/operators';
import {
    getAnimeRatesMetadataAction,
    getAnimeRatesMetadataFailureAction,
    getAnimeRatesMetadataSuccessAction,
    initLoadingMetadataAction,
    loadAllUserAnimeRatesAction,
    loadAllUserAnimeRatesFailureAction,
    loadAllUserAnimeRatesSuccessAction,
} from '@app/modules/home/store/anime-rates/actions';
import { selectAnimeStatusOrder } from '@app/store/settings/selectors/settings.selectors';
import { selectRatesMetadata } from '@app/modules/home/store/anime-rates/selectors';
import { selectRecentAnimes } from '@app/modules/home/store/recent-animes';
import { splitArrayToChunks } from '@app/shared/utils/split-array-to-chunks.funtion';

@Injectable()
export class AnimeRatesEffects {
    private readonly actions$ = inject(Actions);
    private readonly store = inject(Store);
    private readonly shikimori = inject(ShikimoriClient);

    readonly METADATA_CHUNK_SIZE = 50;
    readonly recentAnimes$ = this.store.select(selectRecentAnimes);
    readonly ratesMetadata$ = this.store.select(selectRatesMetadata);
    readonly animeStatusOrder = this.store.selectSignal(selectAnimeStatusOrder);

    private getRateStatusIndex(animeRateStatus: ExtendedUserRateStatusType): number {
        return this.animeStatusOrder().findIndex((ordered) => ordered === animeRateStatus);
    }

    loadAllUserAnimeRates$ = createEffect(() => this.actions$.pipe(
        ofType(loadAllUserAnimeRatesAction),
        exhaustMap(({ userId }) => this.shikimori.getUserRates(userId, UserRateTargetEnum.ANIME).pipe(
            map((rates) => loadAllUserAnimeRatesSuccessAction({ userId, rates })),
            catchError((errors) => of(loadAllUserAnimeRatesFailureAction({ errors }))),
        )),
    ));

    generateMetadataActions$ = createEffect(() => this.actions$.pipe(
        ofType(loadAllUserAnimeRatesSuccessAction),
        map(({ rates }) => [...rates]?.sort(
            (a, b) => this.getRateStatusIndex(a.status) - this.getRateStatusIndex(b.status)),
        ),
        concatLatestFrom(() => [this.recentAnimes$, this.ratesMetadata$]),
        switchMap(([rates, recentAnimes, metadata]) => {
            const ratesOrder = this.animeStatusOrder();
            const combindedRates = [...recentAnimes, ...rates];
            const rateIds = combindedRates?.map(({ target_id: animeId }) => animeId) || [];
            const missingRateIds = rateIds?.filter((animeId) => !metadata?.[animeId]);
            const chunkedMissingIds = splitArrayToChunks(missingRateIds, this.METADATA_CHUNK_SIZE);

            const splitByStatusMissingRates = ratesOrder
                ?.map((orderedStatus) => combindedRates.filter(({ status }) => status === orderedStatus));

            const actions = [
                // сколько незагруженных метаданных нужно догрузить, чтобы отобразить каждую секцию
                ...splitByStatusMissingRates
                    .map((rates, i) => initLoadingMetadataAction({ status: ratesOrder[i], count: rates.length })),
                // грузим отсутсвующие метаданные сортированные по секциям
                // от тех, что пользователь увидит сначала до поздних
                // побиты на массивы по METADATA_CHUNK_SIZE, т.к. Шикимори больше отдать не может
                ...chunkedMissingIds
                    .map((animeIds) => getAnimeRatesMetadataAction({ animeIds })),
            ];

            return actions;
        }),
    ));

    loadMetadata$ = createEffect(() => this.actions$.pipe(
        ofType(getAnimeRatesMetadataAction),
        delay(333),
        concatMap(({ animeIds }) => this.shikimori.getUserAnimeRatesMetadataGQL(animeIds).pipe(
            retry({ count: 3, delay: 500, resetOnSuccess: true }),
            map((metadata) => getAnimeRatesMetadataSuccessAction({ metadata })),
            catchError((errors) => of(getAnimeRatesMetadataFailureAction({ errors }))),
        )),
    ));
}
