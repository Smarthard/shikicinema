import { Injectable } from '@angular/core';
import {
    Actions,
    createEffect,
    ofType,
} from '@ngrx/effects';
import {
    catchError,
    delay,
    filter,
    map,
    mergeMap,
    switchMap,
    withLatestFrom,
} from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import {
    loadAnimeRateByStatusAction,
    loadAnimeRateByStatusFailureAction,
    loadAnimeRateByStatusSuccessAction,
} from '@app/home/store/anime-rates/actions/load-anime-rate.action';
import { AnimeNameSortingConfig } from '@app/shared/utils/rx-anime-rates-functions';
import {
    isDuplicateArrayFilter,
    sortAnimeRatesByUserRating,
} from '@app/home/store/anime-rates/helpers/anime-rates.helpers';
import { Action, Store } from '@ngrx/store';
import {
    isRatesLoadedByStatusSelector,
    ratesByStatusSelector,
    ratesPageByStatusSelector,
} from '@app/home/store/anime-rates/selectors/anime-rates.selectors';
import {
    allPagesLoadedForStatusAction,
    incrementPageForStatusAction
} from '@app/home/store/anime-rates/actions/anime-rate-paging.actions';
import { animePaginationSizeSelector } from '@app/store/settings/selectors/settings.selectors';
import { updateSettingsAction } from '@app/store/settings/actions/settings.actions';
import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';

@Injectable()
export class AnimeRatesEffects {

    loadAnimeRateByStatusEffect$ = createEffect(() => this.actions$.pipe(
        ofType(loadAnimeRateByStatusAction),
        mergeMap((action) => of(action).pipe(
            withLatestFrom(
                this.store$.select(ratesPageByStatusSelector(action.status)),
                this.store$.select(isRatesLoadedByStatusSelector(action.status)),
                this.store$.select(animePaginationSizeSelector),
            ),
        )),
        switchMap(([{ status, userId }, page, isLoad, limit]) => !isLoad ? this.shikimoriClient.getUserAnimeRates(userId, {
            status, page, limit,
        })
            .pipe(
                withLatestFrom(this.store$.select(ratesByStatusSelector(status))),
                mergeMap(([newRates, oldRates]) => {
                    const animeNameSortCfg: AnimeNameSortingConfig = { compareOriginalName: true, caseSensitive: false };
                    const isAllRatesLoaded = newRates?.length < limit;
                    const maxItemsLoaded = page * limit;
                    const rates = [ ...oldRates, ...newRates ]
                        .sort(sortAnimeRatesByUserRating(status, animeNameSortCfg))
                        .filter(isDuplicateArrayFilter);
                    const actions: Action[] = [
                        loadAnimeRateByStatusSuccessAction({ status, rates, userId, newRates }),
                    ];

                    actions.push(isAllRatesLoaded
                        ? allPagesLoadedForStatusAction({ status, maxItemsLoaded })
                        : incrementPageForStatusAction({ status })
                    );

                    return actions;
                }),
                catchError((errors) => of(loadAnimeRateByStatusFailureAction({ status, errors })))
            )
            : EMPTY)
    ));

    scheduleNextPageLoadEffect$ = createEffect(() => this.actions$.pipe(
        ofType(loadAnimeRateByStatusSuccessAction),
        // schedule next page of rates if not all have loaded
        // it would dispatch an extra load action with delay
        // until items amount is more or equal than page limit
        withLatestFrom(this.store$.select(animePaginationSizeSelector)),
        filter(([{ newRates }, limit ]) => newRates?.length >= limit),
        delay(1000), // <-- Shikimori API is limited by 5 rps, 90 rpm!
        switchMap(([ action ]) => of(action).pipe(
            map(({ userId, status }) => loadAnimeRateByStatusAction({ userId, status })),
            catchError((errors) => of(loadAnimeRateByStatusFailureAction({ errors, status: action.status }))),
        )),
    ));

    allPagesLoadedForStatus$ = createEffect(() => this.actions$.pipe(
        ofType(allPagesLoadedForStatusAction),
        withLatestFrom(this.store$.select(animePaginationSizeSelector)),
        filter(([{ maxItemsLoaded }, pageSize]) => maxItemsLoaded > pageSize),
        map(([{ maxItemsLoaded }]) => {
            const config: Pick<SettingsStoreInterface, 'animePaginationSize'> = { animePaginationSize: maxItemsLoaded };

            return updateSettingsAction({ config });
        })
    ));

    constructor(
        private actions$: Actions,
        private store$: Store,
        private shikimoriClient: ShikimoriClient,
    ) {}
}
