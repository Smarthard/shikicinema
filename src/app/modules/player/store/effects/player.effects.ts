import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastController } from '@ionic/angular/standalone';
import { TranslocoService } from '@ngneat/transloco';
import {
    catchError,
    debounceTime,
    filter,
    map,
    tap,
} from 'rxjs/operators';
import { concatLatestFrom } from '@ngrx/operators';
import { merge, of, switchMap } from 'rxjs';

import { ShikicinemaV1ClientService, ShikimoriClient } from '@app/shared/services';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';
import {
    addVideosAction,
    findVideosAction,
    getAnimeInfoAction,
    getAnimeInfoFailureAction,
    getAnimeInfoSuccessAction,
    watchAnimeAction,
} from '@app/modules/player/store/actions';
import { getLastAiredEpisode, toUserRatesUpdate } from '@app/modules/player/utils';
import {
    selectPlayerAnime,
    selectPlayerUserRate,
    selectPlayerVideos,
} from '@app/modules/player/store/selectors/player.selectors';
import { selectShikimoriCurrentUser } from '@app/store/shikimori/selectors/shikimori.selectors';
import { shikicinemaVideoMapper } from '@app/shared/types/shikicinema/v1';
import { toVideoInfo } from '@app/shared/rxjs';
import { watchAnimeFailureAction, watchAnimeSuccessAction } from '@app/modules/player/store/actions/player.actions';

@Injectable()
export class PlayerEffects {
    findVideos$ = createEffect(() => this.actions$.pipe(
        ofType(findVideosAction),
        concatLatestFrom(({ animeId }) => this.store$.select(selectPlayerVideos(animeId))),
        filter(([, videos]) => !videos?.length),
        switchMap(
            ([{ animeId }]) => merge(
                this.shikivideos.findAnimes(animeId),
            ).pipe(
                /* accumulating videos into storage */
                toVideoInfo(shikicinemaVideoMapper),
                map((videos) => addVideosAction({ animeId, videos })),
            ),
        ),
    ));

    getAnimeInfo$ = createEffect(() => this.actions$.pipe(
        ofType(getAnimeInfoAction),
        debounceTime(50),
        concatLatestFrom(({ animeId }) => this.store$.select(selectPlayerAnime(animeId))),
        filter(([, anime]) => !anime?.id),
        switchMap(([{ animeId }]) => this.shikimori.getAnimeInfo(animeId)),
        map((anime) => getAnimeInfoSuccessAction({ anime })),
        catchError(() => of(getAnimeInfoFailureAction())),
    ));

    watchAnime$ = createEffect(() => this.actions$.pipe(
        ofType(watchAnimeAction),
        concatLatestFrom(({ animeId }) => [
            this.store$.select(selectShikimoriCurrentUser),
            this.store$.select(selectPlayerUserRate(animeId)),
            this.store$.select(selectPlayerAnime(animeId)),
        ]),
        map(([{ animeId, episode: episodes, isRewarch }, user, rate, anime]) => {
            const lastAiredEpisode = getLastAiredEpisode(anime);
            const isLastEpisodeWatched = episodes >= lastAiredEpisode;
            const status: UserRateStatusType = isLastEpisodeWatched
                ? 'completed'
                : isRewarch ? 'rewatching' : 'watching';

            // убираем лишние поля, если у пользователя есть user_rate
            // если нет, создаем сразу с нужными значениями
            return toUserRatesUpdate({
                ...rate || {} as UserAnimeRate,
                user_id: user.id,
                target_id: animeId,
                target_type: 'Anime',
                episodes,
                status,
            });
        }),
        switchMap((userRate) => (userRate?.id
            ? this.shikimori.updateUserRate(userRate)
            : this.shikimori.createUserRate(userRate)
        ).pipe(
            map((userRate) => watchAnimeSuccessAction({ userRate })),
            catchError((errors) => of(watchAnimeFailureAction({ errors }))),
        )),
    ));

    watchAnimeSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(watchAnimeSuccessAction),
        tap(async () => {
            const toast = await this.toast.create({
                id: 'shikimori-user-rate-success',
                message: this.translate.translate('PLAYER_MODULE.PLAYER_PAGE.WATCH_ACTION.SUCCESS'),
                color: 'success',
                duration: 1000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    watchAnimeFailure$ = createEffect(() => this.actions$.pipe(
        ofType(watchAnimeFailureAction),
        tap(async ({ errors }) => {
            const toast = await this.toast.create({
                id: 'shikimori-user-rate-failure',
                header: this.translate.translate('PLAYER_MODULE.PLAYER_PAGE.WATCH_ACTION.FAILURE'),
                message: errors.message,
                color: 'danger',
                duration: 10000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    constructor(
        private actions$: Actions,
        private store$: Store,
        private shikivideos: ShikicinemaV1ClientService,
        private shikimori: ShikimoriClient,
        private toast: ToastController,
        private translate: TranslocoService,
    ) {}
}
