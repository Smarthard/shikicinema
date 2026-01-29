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
    distinctUntilChanged,
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
import { UserRateTargetEnum } from '@app/shared/types/shikimori';
import {
    addVideosAction,
    deleteCommentAction,
    deleteCommentFailureAction,
    deleteCommentSuccessAction,
    editCommentAction,
    editCommentFailureAction,
    editCommentSuccessAction,
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
import { getMaxEpisode, toUserRatesUpdate } from '@app/modules/player/utils';
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
import { visitAnimePageAction } from '@app/modules/home/store/recent-animes';


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
            const maxEpisode = getMaxEpisode(anime);
            const isLastEpisodeWatched = episodes >= maxEpisode;
            const isOngoing = anime.status !== 'released';
            const status: UserRateStatusType = isLastEpisodeWatched && !isOngoing
                ? 'completed'
                : isRewarch ? 'rewatching' : 'watching';
            const rewatches = isLastEpisodeWatched && isRewarch
                ? rate?.rewatches + 1
                : rate?.rewatches || 0;

            // убираем лишние поля, если у пользователя есть user_rate
            // если нет, создаем сразу с нужными значениями
            return toUserRatesUpdate({
                ...rate || {} as UserAnimeRate,
                user_id: user.id,
                target_id: animeId,
                target_type: UserRateTargetEnum.ANIME,
                episodes,
                status,
                rewatches,
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
        concatLatestFrom(({ animeId, episode }) => this.store$.select(selectPlayerTopic(animeId, episode))),
        switchMap(([{ animeId, episode, commentText }, topic]) => (!topic?.id
            // если топика для комментирования эпизода нет - его надо создать
            ? this.shikimori.createEpisodeTopic(animeId, episode).pipe(
                switchMap(() => this.shikimori.getTopics(animeId, episode, true).pipe(
                    map((newTopic) => {
                        const newTopicId = newTopic?.[0]?.id;

                        if (!newTopicId) {
                            throw new Error('Topic id missing');
                        }

                        return newTopicId;
                    }),
                )),
            )
            : of(topic.id))
            .pipe(
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

    updateTopicAfterCommentSent$ = createEffect(() => this.actions$.pipe(
        ofType(sendCommentSuccessAction),
        map(({ animeId, episode }) => getTopicsAction({ animeId, episode, revalidate: true })),
    ));

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
        switchMap(({ userId, animeId }) => this.shikimori.getUserRate(userId, animeId, UserRateTargetEnum.ANIME).pipe(
            map((userRates) => getUserRateSuccessAction({ animeId, userRate: userRates?.[0] || null })),
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

    editComment$ = createEffect(() => this.actions$.pipe(
        ofType(editCommentAction),
        switchMap(({ animeId, episode, comment }) => this.shikimori.editComment(comment).pipe(
            map((edittedComment) => editCommentSuccessAction({ animeId, episode, comment: edittedComment })),
            catchError((errors) => of(editCommentFailureAction({ errors }))),
        )),
    ));

    editCommentSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(editCommentSuccessAction),
        tap(async () => {
            const toast = await this.toast.create({
                id: 'shikimori-edit-comment-success',
                message: this.translate.translate('PLAYER_MODULE.PLAYER_PAGE.COMMENT_ACTIONS.EDIT_SUCCESS'),
                color: 'success',
                duration: 1000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    editCommentFailure$ = createEffect(() => this.actions$.pipe(
        ofType(editCommentFailureAction),
        tap(async () => {
            const toast = await this.toast.create({
                id: 'shikimori-edit-comment-failure',
                message: this.translate.translate('PLAYER_MODULE.PLAYER_PAGE.COMMENT_ACTIONS.EDIT_FAILURE'),
                color: 'danger',
                duration: 1000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    deleteComment$ = createEffect(() => this.actions$.pipe(
        ofType(deleteCommentAction),
        switchMap(({ animeId, episode, comment }) => this.shikimori.deleteComment(comment.id).pipe(
            map(() => deleteCommentSuccessAction({ animeId, episode, commentId: comment.id })),
            catchError((errors) => of(deleteCommentFailureAction({ errors }))),
        )),
    ));

    deleteCommentSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(deleteCommentSuccessAction),
        tap(async () => {
            const toast = await this.toast.create({
                id: 'shikimori-delete-comment-success',
                message: this.translate.translate('PLAYER_MODULE.PLAYER_PAGE.COMMENT_ACTIONS.DELETE_SUCCESS'),
                color: 'success',
                duration: 1000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    deleteCommentFailure$ = createEffect(() => this.actions$.pipe(
        ofType(deleteCommentFailureAction),
        tap(async () => {
            const toast = await this.toast.create({
                id: 'shikimori-delete-comment-failure',
                message: this.translate.translate('PLAYER_MODULE.PLAYER_PAGE.COMMENT_ACTIONS.DELETE_FAILURE'),
                color: 'danger',
                duration: 1000,
            });

            await toast.present();
        }),
    ), { dispatch: false });

    loadTopicOnVisitAnime$ = createEffect(() => this.actions$.pipe(
        ofType(visitAnimePageAction),
        distinctUntilChanged((a, b) => a.anime === b.anime && a.episode === b.episode),
        map(({ anime, episode }) => getTopicsAction({ animeId: anime.id, episode, revalidate: false })),
    ));

    loadCommentsOnTopicExists$ = createEffect(() => this.actions$.pipe(
        ofType(getTopicsSuccessAction),
        map(({ animeId, episode }) => getCommentsAction({ animeId, episode, page: 1, limit: 30 })),
    ));
}
