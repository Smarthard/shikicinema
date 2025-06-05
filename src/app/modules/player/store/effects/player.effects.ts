import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastController } from '@ionic/angular/standalone';
import { TranslocoService } from '@jsverse/transloco';
import {
    catchError,
    debounceTime,
    delay,
    exhaustMap,
    filter,
    first,
    map,
    mergeMap,
    tap,
} from 'rxjs/operators';
import { concatLatestFrom } from '@ngrx/operators';
import { merge, of, switchMap } from 'rxjs';

import { KodikClient, ShikicinemaV1Client, ShikimoriClient } from '@app/shared/services';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';
import {
    addVideosAction,
    findVideosAction,
    getAnimeInfoAction,
    getAnimeInfoFailureAction,
    getAnimeInfoSuccessAction,
    getCommentsAction,
    getCommentsFailureAction,
    getCommentsSuccessAction,
    getTopicsAction,
    getTopicsFailureAction,
    getTopicsSuccessAction,
    getUserRateAction,
    getUserRateFailureAction,
    getUserRateSuccessAction,
    sendCommentAction,
    sendCommentFailureAction,
    sendCommentSuccessAction,
    watchAnimeAction,
    watchAnimeFailureAction,
    watchAnimeSuccessAction,
} from '@app/modules/player/store/actions';
import { getLastAiredEpisode, toUserRatesUpdate } from '@app/modules/player/utils';
import { kodikVideoMapper } from '@app/shared/types/kodik/mappers';
import {
    selectPlayerAnime,
    selectPlayerComments,
    selectPlayerTopic,
    selectPlayerUserRate,
    selectPlayerVideos,
} from '@app/modules/player/store/selectors/player.selectors';
import { selectShikimoriCurrentUser } from '@app/store/shikimori/selectors/shikimori.selectors';
import { shikicinemaVideoMapper } from '@app/shared/types/shikicinema/v1';
import { toVideoInfo } from '@app/shared/rxjs';


@Injectable()
export class PlayerEffects {
    private readonly actions$ = inject(Actions);
    private readonly store$ = inject(Store);
    private readonly shikimori = inject(ShikimoriClient);
    private readonly kodik = inject(KodikClient);
    private readonly toast = inject(ToastController);
    private readonly translate = inject(TranslocoService);
    private readonly shikivideos = inject(ShikicinemaV1Client);

    findVideos$ = createEffect(() => this.actions$.pipe(
        ofType(findVideosAction),
        concatLatestFrom(({ animeId }) => this.store$.select(selectPlayerVideos(animeId))),
        filter(([, videos]) => !videos?.length),
        switchMap(
            ([{ animeId }]) => merge(
                this.shikivideos.findAnimes(animeId).pipe(toVideoInfo(shikicinemaVideoMapper)),
                this.kodik.findAnimes(animeId).pipe(toVideoInfo(kodikVideoMapper)),
            ).pipe(
                /* accumulating videos into storage */
                map((videos) => addVideosAction({ animeId, videos })),
            ),
        ),
    ));

    getAnimeInfo$ = createEffect(() => this.actions$.pipe(
        ofType(getAnimeInfoAction),
        debounceTime(50),
        concatLatestFrom(({ animeId }) => this.store$.select(selectPlayerAnime(animeId))),
        filter(([, anime]) => !anime?.id),
        switchMap(([{ animeId }]) => this.shikimori.getAnimeInfo(animeId).pipe(
            map((anime) => getAnimeInfoSuccessAction({ anime })),
            catchError(() => of(getAnimeInfoFailureAction())),
        )),
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
            map((userRate) => watchAnimeSuccessAction({ animeId: userRate.target_id, userRate })),
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

    getTopics$ = createEffect(() => this.actions$.pipe(
        ofType(getTopicsAction),
        concatLatestFrom(({ animeId, episode }) => this.store$.select(selectPlayerTopic(animeId, episode))),
        filter(([, topic]) => !topic?.id),
        switchMap(([{ animeId, episode, revalidate }]) => this.shikimori.getTopics(animeId, episode, revalidate).pipe(
            map((topics) => getTopicsSuccessAction({ animeId, episode, topics })),
            catchError((errors) => of(getTopicsFailureAction({ errors }))),
        )),
    ));

    getComments$ = createEffect(() => this.actions$.pipe(
        ofType(getCommentsAction),
        mergeMap(({ animeId, episode, page, limit }) => this.store$.select(selectPlayerTopic(animeId, episode)).pipe(
            first((topic) => !!topic?.id),
            concatLatestFrom(() => this.store$.select(selectPlayerComments(animeId, episode))),
            filter(([topic, comments]) => comments?.length < topic?.comments_count),
            mergeMap(([topic]) => this.shikimori.getComments(topic.id, page, limit, '1').pipe(
                map((comments) => getCommentsSuccessAction({ animeId, episode, page, limit, comments })),
                catchError((errors) => of(getCommentsFailureAction({ errors }))),
            )),
        )),
    ));

    getCommentsSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(getCommentsSuccessAction),
        filter(({ comments, limit }) => comments?.length > limit),
        delay(250),
        map(({ comments: _comments, page, ...rest }) => getCommentsAction({ ...rest, page: page + 1 })),
        catchError((errors) => of(getCommentsFailureAction({ errors }))),
    ));

    sendComment$ = createEffect(() => this.actions$.pipe(
        ofType(sendCommentAction),
        switchMap(({ animeId, episode, commentText }) => this.store$.select(selectPlayerTopic(animeId, episode)).pipe(
            switchMap((topic) =>
                !topic?.id
                    ? this.shikimori.createEpisodeTopic(animeId, episode).pipe(
                        // eslint-disable-next-line camelcase
                        map(({ topic_id }) => topic_id),
                    )
                    : of(topic.id),
            ),
            exhaustMap((commentableId) => this.shikimori.createComment(commentableId, commentText)),
            map((comment) => sendCommentSuccessAction({ animeId, episode, comment })),
            catchError((errors) => of(sendCommentFailureAction({ errors }))),
        )),
    ));

    sendCommentSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(sendCommentSuccessAction),
        tap(async () => {
            const toast = await this.toast.create({
                id: 'shikimori-send-comment-success',
                message: this.translate.translate('PLAYER_MODULE.PLAYER_PAGE.USER_COMMENT_FORM.SEND_SUCCESS'),
                color: 'success',
                duration: 1000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    sendCommentFailure$ = createEffect(() => this.actions$.pipe(
        ofType(sendCommentFailureAction),
        tap(async () => {
            const toast = await this.toast.create({
                id: 'shikimori-send-comment-error',
                message: this.translate.translate('PLAYER_MODULE.PLAYER_PAGE.USER_COMMENT_FORM.SEND_FAILURE'),
                color: 'danger',
                duration: 1000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    getUserRate$ = createEffect(() => this.actions$.pipe(
        ofType(getUserRateAction),
        debounceTime(50),
        switchMap(({ id, animeId }) => this.shikimori.getUserRateById(id).pipe(
            map((userRate) => getUserRateSuccessAction({ animeId, userRate })),
            catchError((error) => {
                // возможно удален пользователем на самом сайте Шикимори
                const isUserRateNotFound = error instanceof HttpErrorResponse &&
                    error.status === HttpStatusCode.NotFound;

                return isUserRateNotFound
                    ? of(getUserRateSuccessAction({ animeId, userRate: null }))
                    : of(getUserRateFailureAction());
            }),
        )),
    ));
}
