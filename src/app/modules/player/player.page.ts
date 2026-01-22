import { Actions, ofType } from '@ngrx/effects';
import { AsyncPipe } from '@angular/common';
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
    untracked,
    viewChild,
} from '@angular/core';
import {
    IonContent,
    IonText,
    ModalController,
    Platform,
    ToastController,
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
import { FilterByKindPipe } from '@app/shared/pipes/filter-by-kind/filter-by-kind.pipe';
import { GetActiveKindsPipe } from '@app/shared/pipes/get-active-kinds/get-active-kinds.pipe';
import { GetShikimoriPagePipe } from '@app/shared/pipes/get-shikimori-page/get-shikimori-page.pipe';
import { KindSelectorComponent } from '@app/modules/player/components/kind-selector/kind-selector.component';
import { NoPreferenceSymbol } from '@app/store/settings/types';
import { PlayerComponent } from '@app/modules/player/components/player/player.component';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { ShikimoriAnimeLinkPipe } from '@app/shared/pipes/shikimori-anime-link/shikimori-anime-link.pipe';
import { SidePanelComponent } from '@app/modules/player/components/side-panel/side-panel.component';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { SwipeDirective } from '@app/shared/directives/swipe.directive';
import { ToUploaderPipe } from '@app/modules/player/pipes';
import { UploaderComponent } from '@app/modules/player/components/uploader/uploader.component';
import { UserCommentFormComponent } from '@app/modules/player/components/user-comment-form/user-comment-form.component';
import { VideoInfoInterface } from '@app/modules/player/types';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';
import { VideoSelectorComponent } from '@app/modules/player/components/video-selector/video-selector.component';
import { authShikimoriAction } from '@app/store/auth/actions/auth.actions';
import {
    authorAvailability,
    filterVideosByDomains,
    getLastAiredEpisode,
    getMaxEpisode,
    isEpisodeWatched,
} from '@app/modules/player/utils';
import {
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
import { filterByEpisode } from '@app/shared/utils/filter-by-episode.function';
import { filterVideosByPreferences } from '@app/modules/player/utils/filter-videos-by-preferences.function';
import { getAnimeName } from '@app/shared/utils/get-anime-name.function';
import { getDomain } from '@app/shared/utils/get-domain.function';
import { isEq } from '@app/shared/utils/is-eq.function';
import { isEqId } from '@app/shared/utils/is-eq-id.function';
import {
    selectAuthorPreferencesByAnime,
    selectDomainFilters,
    selectDomainPreferencesByAnime,
    selectKindPreferencesByAnime,
    selectPlayerKindDisplayMode,
    selectPlayerMode,
    selectPreferencesToggle,
} from '@app/store/settings/selectors/settings.selectors';
import { selectIsAuthenticated } from '@app/store/auth/selectors/auth.selectors';
import {
    selectPlayerAnime,
    selectPlayerAnimeLoading,
    selectPlayerComments,
    selectPlayerIsCommentsLoading,
    selectPlayerIsCommentsPartiallyLoading,
    selectPlayerIsShownAllComments,
    selectPlayerUserRate,
    selectPlayerVideos,
    selectPlayerVideosLoading,
} from '@app/modules/player/store/selectors/player.selectors';
import {
    togglePlayerModeAction,
    updatePlayerPreferencesAction,
} from '@app/store/settings/actions/settings.actions';
import { uploadVideoAction } from '@app/store/shikicinema/actions/upload-video.action';
import { visitAnimePageAction } from '@app/modules/home/store/recent-animes/actions';


@Component({
    selector: 'app-player-page',
    templateUrl: './player.page.html',
    styleUrl: './player.page.scss',
    imports: [
        AsyncPipe,
        PlayerComponent,
        VideoSelectorComponent,
        KindSelectorComponent,
        SkeletonBlockComponent,
        GetActiveKindsPipe,
        FilterByKindPipe,
        ControlPanelComponent,
        UploaderComponent,
        ToUploaderPipe,
        SwipeDirective,
        CommentsComponent,
        UserCommentFormComponent,
        ShikimoriAnimeLinkPipe,
        GetShikimoriPagePipe,
        SidePanelComponent,
        IonText,
        IonContent,
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
    private readonly toast = inject(ToastController);
    private readonly transloco = inject(TranslocoService);
    private readonly modalController = inject(ModalController);
    private readonly destroyRef = inject(DestroyRef);

    readonly animeId = input.required<string>();
    readonly episode = input.required<string>();

    private readonly userCommentFormEl = viewChild('userCommentForm', { read: ElementRef });

    readonly isPreferencesToggleOn = this.store.selectSignal(selectPreferencesToggle);
    readonly playerMode = this.store.selectSignal(selectPlayerMode);
    readonly playerKindDisplayMode = this.store.selectSignal(selectPlayerKindDisplayMode);
    readonly isUserAuthorized = this.store.selectSignal(selectIsAuthenticated);
    readonly domainFilters = this.store.selectSignal(selectDomainFilters);

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
    anime = computed(() => this.store.selectSignal(selectPlayerAnime(this.animeIdQ()))(), { equal: isEqId });
    userRate = computed(() => this.store.selectSignal(selectPlayerUserRate(this.animeIdQ()))());
    authorPreferences = computed(() => this.store.selectSignal(selectAuthorPreferencesByAnime(this.animeIdQ()))());
    kindPreferences = computed(() => this.store.selectSignal(selectKindPreferencesByAnime(this.animeIdQ()))());
    domainPreferences = computed(() => this.store.selectSignal(selectDomainPreferencesByAnime(this.animeIdQ()))());
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
    maxEpisode = computed(() => getMaxEpisode(this.anime()));
    animeName = computed(() => getAnimeName(this.anime(), this.userSelectedLanguage()));
    isWatched = computed(() => isEpisodeWatched(this.episodeQ(), this.userRate()));
    isRewatching = computed(() => this.userRate()?.status === 'rewatching');

    isDomainFilterOn = signal(true);
    episodeVideosUnfiltered = computed(() => filterByEpisode(this.videos(), this.episodeQ()));
    episodeVideosFiltered = computed(() => filterVideosByDomains(this.episodeVideosUnfiltered(), this.domainFilters()));
    episodeVideos = computed(() => this.isDomainFilterOn()
        ? this.episodeVideosFiltered()
        : this.episodeVideosUnfiltered(),
    );
    hasUnfilteredVideos = computed(() => this.episodeVideosUnfiltered()?.length > 0 && this.isDomainFilterOn());

    nextEpisodeAt = computed(() => {
        const nextEpisodeAt = this.anime()?.next_episode_at;
        const isCurrentEpisodeNotAired = this.episodeQ() > this.lastAiredEpisode();

        return isCurrentEpisodeNotAired ? nextEpisodeAt : null;
    });

    authorAvailability = computed(() => authorAvailability(this.videos(), this.lastAiredEpisode()));

    currentVideo = signal<VideoInfoInterface>(null);
    currentKind = signal<VideoKindEnum>(null);
    isOrientationPortrait = signal<boolean>(false);
    editComment = signal<Comment>(null);
    highlightComment = signal<ResourceIdType>(null);

    readonly animeChangeEffect = effect(() => {
        const animeId = this.animeIdQ();

        this.store.dispatch(findVideosAction({ animeId }));
        this.store.dispatch(getAnimeInfoAction({ animeId }));
    });

    readonly episodeVideosChangeEffect = effect(() => {
        const videos = this.episodeVideos();

        untracked(() => {
            const author = this.authorPreferences();
            const domain = this.domainPreferences();
            const kind = this.kindPreferences();
            const isPreferencesToggleOn = this.isPreferencesToggleOn();

            if (videos?.length > 0) {
                const relevantVideos = isPreferencesToggleOn
                    ? filterVideosByPreferences(videos, author, domain, kind)
                    : videos;

                if (!relevantVideos &&
                    author !== NoPreferenceSymbol &&
                    domain !== NoPreferenceSymbol &&
                    kind !== NoPreferenceSymbol
                ) {
                    this.toast.create({
                        id: 'player-relevant-videos-missing',
                        color: 'warning',
                        message: this.transloco.translate('PLAYER_MODULE.PLAYER_PAGE.RELEVANT_VIDEOS_MISSING'),
                        duration: 1000,
                    }).then((toast) => toast.present());
                }

                const chosenVideo = (relevantVideos || videos)?.[0];

                this.onVideoChange(chosenVideo, false);
            }
        });
    });

    readonly animeOrEpisodeChangeEffect = effect(() => {
        const anime = this.anime();
        const episode = this.episodeQ();

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
        this.currentKind.set(video.kind);

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

        if (episode <= maxEpisodes && episode > 0) {
            void this.router.navigate(['/player', animeId, episode]);
        }
    }

    // TODO: для модалок нужно придумать какой-то сервис - слишком много бойлерплейта
    async onOpenVideoSelectorModal(): Promise<void> {
        const prevVideo = this.currentVideo();

        const componentProps = {
            videos: this.videos,
            episodeVideos: this.episodeVideos,
            kindDisplayMode: this.playerKindDisplayMode,
            isDomainFilterOn: this.isDomainFilterOn,
            hasUnfilteredVideos: this.hasUnfilteredVideos,
            selectedKind: this.currentKind,
            selectedVideo: this.currentVideo,
            lastAiredEpisode: this.lastAiredEpisode,
        };
        const { VideoSelectorModalComponent } = await import('@app/modules/player/components/video-selector-modal');

        const modal = await this.modalController.create({
            component: VideoSelectorModalComponent,
            componentProps,
        });

        modal.present();

        const { role } = await modal.onDidDismiss<VideoInfoInterface>();

        if (role === 'cancel') {
            this.onVideoChange(prevVideo);
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

    onVideoUpload(video: VideoInfoInterface): void {
        const animeId = this.animeIdQ();

        this.store.dispatch(uploadVideoAction({ animeId, video }));
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
