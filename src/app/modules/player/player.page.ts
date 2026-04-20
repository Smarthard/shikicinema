import { Actions, ofType } from '@ngrx/effects';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    computed,
    effect,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import {
    IonContent,
    ModalController,
    Platform,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import {
    debounceTime,
    map,
    take,
    tap,
} from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { Comment } from '@app/shared/types/shikimori/comment';
import { CommentsComponent } from '@app/modules/player/components/comments/comments.component';
import { ControlPanelComponent } from '@app/modules/player/components/control-panel/control-panel.component';
import { DescriptionComponent } from '@app/modules/player/components/description/description.component';
import { PlayerComponent } from '@app/modules/player/components/player/player.component';
import { PlayerSelectorComponent } from '@app/modules/player/components/player-selector/player-selector.component';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { SidePanelComponent } from '@app/modules/player/components/side-panel/side-panel.component';
import { SwipeDirective } from '@app/shared/directives/swipe.directive';
import { UserCommentFormComponent } from '@app/modules/player/components/user-comment-form/user-comment-form.component';
import { VideoInfoInterface } from '@app/modules/player/types';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';
import { authShikimoriAction } from '@app/store/auth/actions/auth.actions';
import {
    changeCurrentAnimeAction,
    changeCurrentEpisodeAction,
    deleteCommentAction,
    editCommentAction,
    editCommentSuccessAction,
    findVideosAction,
    getAnimeInfoAction,
    sendCommentAction,
    setIsShownAllAction,
    watchAnimeAction,
    watchAnimeSuccessAction,
} from '@app/modules/player/store/actions';
import { getAnimeName } from '@app/shared/utils/get-anime-name.function';
import { getDomain } from '@app/shared/utils/get-domain.function';
import {
    getLastAiredEpisode,
    getMaxEpisode,
    getMaxEpisodeFromVideos,
    isEpisodeWatched,
} from '@app/modules/player/utils';
import { isEq } from '@app/shared/utils/is-eq.function';
import { isEqId } from '@app/shared/utils/is-eq-id.function';
import {
    selectCurrentPlayerAnime,
    selectPlayerAnimeLoading,
    selectPlayerComments,
    selectPlayerIsCommentsLoading,
    selectPlayerIsCommentsPartiallyLoading,
    selectPlayerIsShownAllComments,
    selectPlayerUserRate,
    selectPlayerVideos,
    selectPlayerVideosLoading,
} from '@app/modules/player/store/selectors/player.selectors';
import { selectIsAuthenticated } from '@app/store/auth/selectors/auth.selectors';
import { selectPlayerMode } from '@app/store/settings/selectors/settings.selectors';
import {
    togglePlayerModeAction,
    updatePlayerPreferencesAction,
} from '@app/store/settings/actions/settings.actions';
import { visitAnimePageAction } from '@app/modules/home/store/recent-animes/actions';


@Component({
    selector: 'app-player-page',
    templateUrl: './player.page.html',
    styleUrl: './player.page.scss',
    imports: [
        PlayerComponent,
        ControlPanelComponent,
        SwipeDirective,
        CommentsComponent,
        UserCommentFormComponent,
        SidePanelComponent,
        IonContent,
        DescriptionComponent,
        PlayerSelectorComponent,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerPage implements OnInit {
    @HostBinding('class.player-page')
    protected playerPageClass = true;

    private readonly store = inject(Store);
    private readonly router = inject(Router);
    private readonly title = inject(Title);
    private readonly platform = inject(Platform);
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly actions$ = inject(Actions);
    private readonly transloco = inject(TranslocoService);
    private readonly modalController = inject(ModalController);
    private readonly destroyRef = inject(DestroyRef);

    readonly animeId = input.required<string>();
    readonly episode = input.required<string>();

    private readonly userCommentFormEl = viewChild('userCommentForm', { read: ElementRef });
    private readonly playerEl = viewChild('player', { read: ElementRef });

    readonly playerHeight = computed(
        () => this.isVideosLoading()
            ? 0
            : this.playerEl()?.nativeElement?.offsetHeight ?? 0,
    );

    readonly playerMode = this.store.selectSignal(selectPlayerMode);
    readonly isUserAuthorized = this.store.selectSignal(selectIsAuthenticated);

    readonly isMediaMatch = toSignal(this.breakpointObserver.observe([
        '(max-width: 1599px) and (max-resolution: 1dppx)',
        '(max-width: 1399px) and (min-resolution: 2dppx)',
    ]).pipe(map(({ matches }) => matches)));

    readonly isSmallScreen = computed(
        () => this.playerMode() !== 'compact' && this.isMediaMatch() || this.playerMode() === 'full',
        { equal: isEq },
    );

    readonly isPanelsMinified = computed(() => this.isOrientationPortrait() || this.isSmallScreen());
    readonly userSelectedLanguage = toSignal(this.transloco.langChanges$);

    animeIdQ = computed(() => this.animeId(), { equal: isEq });
    episodeQ = computed(() => Number(this.episode()), { equal: isEq });

    isVideosLoading = computed(() => this.store.selectSignal(selectPlayerVideosLoading(this.animeIdQ()))());
    videos = computed(() => this.store.selectSignal(selectPlayerVideos(this.animeIdQ()))());
    isAnimeLoading = computed(() => this.store.selectSignal(selectPlayerAnimeLoading(this.animeIdQ()))());
    anime = this.store.selectSignal(selectCurrentPlayerAnime, { equal: isEqId });
    userRate = computed(() => this.store.selectSignal(selectPlayerUserRate(this.animeIdQ()))());
    comments = computed(() => this.store.selectSignal(selectPlayerComments(this.animeIdQ(), this.episodeQ()))());
    isShownAllComments = computed(() => this.store.selectSignal(
        selectPlayerIsShownAllComments(this.animeIdQ(), this.episodeQ()),
    )());
    isCommentsLoading = computed(() => this.store.selectSignal(
        selectPlayerIsCommentsLoading(this.animeIdQ(), this.episodeQ()),
    )());
    isCommentsPartiallyLoading = computed(() => this.store.selectSignal(
        selectPlayerIsCommentsPartiallyLoading(this.animeIdQ(), this.episodeQ()),
    )());

    lastAiredEpisode = computed(() => getLastAiredEpisode(this.anime()));
    maxVideosEpisode = computed(() => getMaxEpisodeFromVideos(this.videos()));
    maxEpisode = computed(() => getMaxEpisode(this.anime(), this.maxVideosEpisode()));
    animeName = computed(() => getAnimeName(this.anime(), this.userSelectedLanguage()));
    isWatched = computed(() => isEpisodeWatched(this.episodeQ(), this.userRate()));
    isRewatching = computed(() => this.userRate()?.status === 'rewatching');

    isDomainFilterOn = signal(true);

    nextEpisodeAt = computed(() => {
        const nextEpisodeAt = this.anime()?.next_episode_at;
        const isCurrentEpisodeNotAired = this.episodeQ() > this.lastAiredEpisode();

        return isCurrentEpisodeNotAired ? nextEpisodeAt : null;
    });

    currentVideo = signal<VideoInfoInterface>(null);
    currentKind = signal<VideoKindEnum>(null);
    isOrientationPortrait = signal<boolean>(false);
    editComment = signal<Comment>(null);
    highlightComment = signal<ResourceIdType>(null);

    readonly animeChangeEffect = effect(() => {
        const animeId = this.animeIdQ();

        this.store.dispatch(changeCurrentAnimeAction({ animeId }));
        this.store.dispatch(findVideosAction({ animeId }));
        this.store.dispatch(getAnimeInfoAction({ animeId }));
    });

    readonly animeOrEpisodeChangeEffect = effect(() => {
        const anime = this.anime();
        const episode = this.episodeQ();

        this.store.dispatch(changeCurrentAnimeAction({ animeId: anime.id }));
        this.store.dispatch(changeCurrentEpisodeAction({ episode }));

        if (anime?.name) {
            this.changeTitle(anime, episode);

            this.store.dispatch(visitAnimePageAction({ anime, episode }));
        }
    });

    ngOnInit(): void {
        this.actions$.pipe(
            ofType(watchAnimeSuccessAction),
            tap(({ userRate }) => this.onEpisodeChange(userRate.episodes + 1)),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe();

        this.platform.resize
            .pipe(
                debounceTime(100),
                tap(() => this.onResize()),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.onResize();
    }

    private onResize(): void {
        this.isOrientationPortrait.set(this.platform.isPortrait());
    }

    private updateUserPreferences(): void {
        const currentVideo = this.currentVideo();

        if (currentVideo) {
            const anime = this.anime();
            const { author, kind, url } = currentVideo;
            const domain = getDomain(url);

            this.store.dispatch(updatePlayerPreferencesAction({ animeId: anime.id, author, kind, domain }));
        }
    }

    changeTitle(anime: AnimeBriefInfoInterface, episode: number): void {
        // TODO: добавить селектор из настроек предпочтений названия аниме, а не просто по языку пользователя
        const animeName = this.animeName();
        const isSeries = getLastAiredEpisode(anime) > 1;
        const translationKey = isSeries
            ? 'PLAYER_MODULE.PLAYER_PAGE.PAGE_TITLE.SERIES'
            : 'PLAYER_MODULE.PLAYER_PAGE.PAGE_TITLE.MOVIE';
        const title = this.transloco.translate(translationKey, { title: animeName, episode });

        this.title.setTitle(title);
    }

    onVideoChange(video: VideoInfoInterface, isShouldUpdatePref = true): void {
        this.currentVideo.set(video);

        this.onKindChange(video?.kind);

        if (isShouldUpdatePref) {
            void this.updateUserPreferences();
        }
    }

    onKindChange(kind: VideoKindEnum): void {
        this.currentKind.set(kind);
    }

    onEpisodeChange(episode: number): void {
        const animeId = this.animeIdQ();
        const maxEpisodes = this.maxEpisode();

        // сброс видео для корректной работы заглушек выхода серий
        this.currentVideo.set(null);

        if (episode <= maxEpisodes && episode > 0) {
            void this.router.navigate(['/player', animeId, episode]);
        }
    }

    // TODO: для модалок нужно придумать какой-то сервис - слишком много бойлерплейта
    async onOpenVideoSelectorModal(): Promise<void> {
        const prevVideo = this.currentVideo();

        const componentProps = {
            selectedVideo: this.currentVideo,
            selectedKind: this.currentKind,
            isFilterDomains: this.isDomainFilterOn,
            animeId: this.animeIdQ,
            episode: this.episodeQ,
            lastAiredEpisode: this.lastAiredEpisode,
            isLoading: this.isVideosLoading,
            videos: this.videos,
        };
        const { VideoSelectorModalComponent } = await import('@app/modules/player/components/video-selector-modal');

        const modal = await this.modalController.create({
            component: VideoSelectorModalComponent,
            componentProps,
        });

        modal.present();

        const { role } = await modal.onDidDismiss<VideoInfoInterface>();

        if (role === 'cancel') {
            this.onVideoChange(prevVideo, false);
        }
    }

    onWatch(episode: number, isUnwatch = false): void {
        const anime = this.anime();
        const userRate = this.userRate();
        const isRewarch = this.isRewatching() || userRate?.status === 'completed';
        const isLastEpisodeWatched = userRate?.episodes >= this.maxEpisode();
        const watchedEpisode = isLastEpisodeWatched
            ? episode
            : isUnwatch ? episode - 1 : episode;

        this.store.dispatch(watchAnimeAction({ animeId: anime.id, episode: watchedEpisode, isRewarch }));

        void this.updateUserPreferences();
    }

    onShowMoreComments(): void {
        const animeId = this.animeIdQ();
        const episode = this.episodeQ();
        const isShownAll = true;

        this.store.dispatch(setIsShownAllAction({ animeId, episode, isShownAll }));
    }

    onCommentSend(commentText: string): void {
        const animeId = this.animeIdQ();
        const episode = this.episodeQ();

        this.store.dispatch(sendCommentAction({ animeId, episode, commentText }));
    }

    togglePlayerMode(): void {
        this.store.dispatch(togglePlayerModeAction());
    }

    onCommentLogin(): void {
        this.store.dispatch(authShikimoriAction());
    }

    onCommentEdit(comment: Comment): void {
        const userCommentFormEl: HTMLElement = this.userCommentFormEl()?.nativeElement;

        this.editComment.set(comment);

        if (userCommentFormEl) {
            /*
                TODO: зарепортить в ionic, либо проверить воспризведение после обновы

                баг Ionic'а:
                промотка, без ожидания завершения анимации закрытия ion-popover ~100мс,
                будет отмыватываться обратно к месту с открытием поповера
            */
            timer(200)
                .pipe(
                    take(1),
                    tap(() => userCommentFormEl.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center',
                    })),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe();
        }
    }

    onCommentSendEdited(comment: Comment): void {
        const animeId = this.animeIdQ();
        const episode = this.episodeQ();

        this.store.dispatch(editCommentAction({
            animeId,
            episode,
            comment,
        }));

        this.actions$.pipe(
            ofType(editCommentSuccessAction),
            take(1),
            tap(() => this.editComment.set(null)),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe();
    }

    onCommentDelete(comment: Comment): void {
        const animeId = this.animeIdQ();
        const episode = this.episodeQ();

        this.store.dispatch(deleteCommentAction({
            animeId,
            episode,
            comment,
        }));
    }

    onHighlightComment(commentId: ResourceIdType): void {
        this.highlightComment.set(commentId);

        // сбрасываем, чтобы повторная подсветка работала
        timer(1000).pipe(
            take(1),
            tap(() => this.highlightComment.set(null)),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe();
    }

    onCancelCommentEdit(): void {
        this.editComment.set(null);
    }

    setDomainFilters(isEnabled: boolean): void {
        this.isDomainFilterOn.set(isEnabled);
    }
}
