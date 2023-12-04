import {
    Actions,
    concatLatestFrom,
    createEffect,
    ofType,
} from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { Injectable } from '@angular/core';
import {
    catchError,
    delay,
    filter,
    map,
    mergeMap,
    switchMap,
    withLatestFrom,
} from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { AnimeNameSortingConfig } from '@app/shared/utils/rx-anime-rates-functions';
import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import {
    allPagesLoadedForStatusAction,
    incrementPageForStatusAction,
} from '@app/home/store/anime-rates/actions/anime-rate-paging.actions';
import {
    isDuplicateArrayFilter,
    sortAnimeRatesByUserRating,
} from '@app/home/store/anime-rates/helpers/anime-rates.helpers';
import {
    loadAnimeRateByStatusAction,
    loadAnimeRateByStatusFailureAction,
    loadAnimeRateByStatusSuccessAction,
} from '@app/home/store/anime-rates/actions/load-anime-rate.action';
import { selectAnimePaginationSize } from '@app/store/settings/selectors/settings.selectors';
import {
    selectIsRatesLoadedByStatus,
    selectRatesByStatus,
    selectRatesPageByStatus,
} from '@app/home/store/anime-rates/selectors/anime-rates.selectors';
import { updateSettingsAction } from '@app/store/settings/actions/settings.actions';

@Injectable()
export class AnimeRatesEffects {
    loadAnimeRateByStatusEffect$ = createEffect(() => this.actions$.pipe(
        ofType(loadAnimeRateByStatusAction),
        concatLatestFrom(({ status }) => [
            this.store.select(selectRatesPageByStatus(status)),
            this.store.select(selectIsRatesLoadedByStatus(status)),
            this.store.select(selectAnimePaginationSize),
        ]),
        switchMap(([{ status, userId }, page, isLoad, limit]) => !isLoad
            ? this.shikimoriClient.getUserAnimeRates(userId, { status, page, limit })
                .pipe(
                    withLatestFrom(this.store.select(selectRatesByStatus(status))),
                    mergeMap(([newRates, oldRates]) => {
                        const animeNameSortCfg: AnimeNameSortingConfig = {
                            compareOriginalName: true,
                            caseSensitive: false,
                        };
                        const isAllRatesLoaded = newRates?.length < limit;
                        const maxItemsLoaded = page * limit;
                        const rates = [...oldRates, ...newRates]
                            .sort(sortAnimeRatesByUserRating(status, animeNameSortCfg))
                            .filter(isDuplicateArrayFilter);
                        const actions: Action[] = [
                            loadAnimeRateByStatusSuccessAction({ status, rates, userId, newRates }),
                        ];

                        actions.push(isAllRatesLoaded
                            ? allPagesLoadedForStatusAction({ status, maxItemsLoaded })
                            : incrementPageForStatusAction({ status }),
                        );

                        return actions;
                    }),
                    catchError((errors) => of(loadAnimeRateByStatusFailureAction({ status, errors }))),
                )
            : EMPTY),
    ));

    scheduleNextPageLoadEffect$ = createEffect(() => this.actions$.pipe(
        ofType(loadAnimeRateByStatusSuccessAction),
        // schedule next page of rates if not all have loaded
        // it would dispatch an extra load action with delay
        // until items amount is more or equal than page limit
        concatLatestFrom(() => this.store.select(selectAnimePaginationSize)),
        filter(([{ newRates }, limit]) => newRates?.length >= limit),
        // Shikimori API is limited by 5 rps, 90 rpm!
        delay(1000),
        switchMap(([action]) => of(action).pipe(
            map(({ userId, status }) => loadAnimeRateByStatusAction({ userId, status })),
            catchError((errors) => of(loadAnimeRateByStatusFailureAction({ errors, status: action.status }))),
        )),
    ));

    allPagesLoadedForStatus$ = createEffect(() => this.actions$.pipe(
        ofType(allPagesLoadedForStatusAction),
        concatLatestFrom(() => this.store.select(selectAnimePaginationSize)),
        filter(([{ maxItemsLoaded }, pageSize]) => maxItemsLoaded > pageSize),
        map(([{ maxItemsLoaded }]) => {
            const config: Pick<SettingsStoreInterface, 'animePaginationSize'> = { animePaginationSize: maxItemsLoaded };

            return updateSettingsAction({ config });
        }),
    ));

    constructor(
        private actions$: Actions,
        private store: Store,
        private shikimoriClient: ShikimoriClient,
    ) {}
}
