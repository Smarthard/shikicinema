import { Actions, ofType } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Inject,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonContent,
    IonText,
    ToastController,
} from '@ionic/angular/standalone';
import { ModalController, Platform } from '@ionic/angular';
import { NgLetDirective } from 'ng-let';
import {
    Observable,
    ReplaySubject,
    combineLatest,
    firstValueFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    switchMap,
    take,
    tap,
    withLatestFrom,
} from 'rxjs/operators';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { CommentsComponent } from '@app/modules/player/components/comments/comments.component';
import { ControlPanelComponent } from '@app/modules/player/components/control-panel/control-panel.component';
import { FilterByKindPipe } from '@app/shared/pipes/filter-by-kind/filter-by-kind.pipe';
import { GetActiveKindsPipe } from '@app/shared/pipes/get-active-kinds/get-active-kinds.pipe';
import { GetEpisodesPipe } from '@app/shared/pipes/get-episodes/get-episodes.pipe';
import { KindSelectorComponent } from '@app/modules/player/components/kind-selector/kind-selector.component';
import { NoPreferenceSymbol } from '@app/store/settings/types';
import { PlayerComponent } from '@app/modules/player/components/player/player.component';
import { SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { ShikimoriAnimeLinkPipe } from '@app/shared/pipes/shikimori-anime-link/shikimori-anime-link.pipe';
import { SidePanelComponent } from '@app/modules/player/components/side-panel/side-panel.component';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { SwipeDirective } from '@app/shared/directives/swipe.directive';
import { ToUploaderPipe } from '@app/modules/player/pipes/to-uploader.pipe';
import { UploaderComponent } from '@app/modules/player/components/uploader/uploader.component';
import { UserCommentFormComponent } from '@app/modules/player/components/user-comment-form/user-comment-form.component';
import { VideoInfoInterface } from '@app/modules/player/types';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';
import { VideoSelectorComponent } from '@app/modules/player/components/video-selector/video-selector.component';
import { WELL_KNOWN_UPLOADERS_MAP } from '@app/shared/config/well-known-uploaders.config';
import { WELL_KNOWN_UPLOADERS_TOKEN } from '@app/shared/types/well-known-uploaders.token';
import { filterByEpisode } from '@app/shared/utils/filter-by-episode.function';
import { filterVideosByPreferences } from '@app/modules/player/utils/filter-videos-by-preferences.function';
import {
    findVideosAction,
    getAnimeInfoAction,
    getCommentsAction,
    getTopicsAction,
    sendCommentAction,
    setIsShownAllAction,
    watchAnimeAction,
    watchAnimeSuccessAction,
} from '@app/modules/player/store/actions';
import { getAnimeName } from '@app/shared/utils/get-anime-name.function';
import { getDomain } from '@app/shared/utils/get-domain.function';
import { getLastAiredEpisode, isEpisodeWatched } from '@app/modules/player/utils';
import {
    selectAuthorPreferencesByAnime,
    selectDomainPreferencesByAnime,
    selectKindPreferencesByAnime,
    selectPlayerKindDisplayMode,
    selectPlayerMode,
    selectPreferencesToggle,
} from '@app/store/settings/selectors/settings.selectors';
import {
    selectPlayerAnime,
    selectPlayerAnimeLoading,
    selectPlayerComments,
    selectPlayerIsCommentsLoading,
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


@UntilDestroy()
@Component({
    selector: 'app-player-page',
    templateUrl: './player.page.html',
    styleUrl: './player.page.scss',
    imports: [
        CommonModule,
        PlayerComponent,
        VideoSelectorComponent,
        KindSelectorComponent,
        SkeletonBlockComponent,
        GetActiveKindsPipe,
        FilterByKindPipe,
        GetEpisodesPipe,
        ControlPanelComponent,
        UploaderComponent,
        ToUploaderPipe,
        SwipeDirective,
        NgLetDirective,
        CommentsComponent,
        UserCommentFormComponent,
        ShikimoriAnimeLinkPipe,
        SidePanelComponent,
        IonText,
        IonContent,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerPage implements OnInit {
    @HostBinding('class.player-page')
    private playerPageClass = true;

    private isOrientationPortraitSubject$ = new ReplaySubject<boolean>(1);

    readonly isPreferencesToggleOn$ = this.store.select(selectPreferencesToggle);
    readonly playerMode$ = this.store.select(selectPlayerMode);
    readonly playerKindDisplayMode$ = this.store.select(selectPlayerKindDisplayMode);

    readonly isSmallScreen$ = combineLatest([
        this.playerMode$,
        this.breakpointObserver.observe([
            '(max-width: 1599px) and (max-resolution: 1dppx)',
            '(max-width: 1399px) and (min-resolution: 2dppx)',
        ]).pipe(map(({ matches }) => matches)),
    ]).pipe(
        map(([playerMode, isMediaMatch]) => playerMode !== 'compact' && isMediaMatch || playerMode === 'full'),
    );

    readonly isPanelsMinified$ = combineLatest([
        this.isOrientationPortraitSubject$,
        this.isSmallScreen$,
    ]).pipe(
        map(([isPortrait, isSmallScreen]) => isPortrait || isSmallScreen),
    );

    readonly isVideoSelectionHidden$ = this.isSmallScreen$;

    animeId$ = this.route.params.pipe(
        map(({ animeId }) => animeId as string),
        distinctUntilChanged(),
    );

    episode$ = this.route.params.pipe(
        map(({ episode }) => Number(episode)),
        distinctUntilChanged(),
    );

    isVideosLoading$ = this.animeId$.pipe<boolean>(
        switchMap((animeId) => this.store.select(selectPlayerVideosLoading(animeId))),
    );
    videos$ = this.animeId$.pipe<VideoInfoInterface[]>(
        switchMap((animeId) => this.store.select(selectPlayerVideos(animeId))),
    );

    isAnimeLoading$ = this.animeId$.pipe(
        switchMap((animeId) => this.store.select(selectPlayerAnimeLoading(animeId))),
    );
    anime$ = this.animeId$.pipe(
        switchMap((animeId) => this.store.select(selectPlayerAnime(animeId))),
    );
    animeName$ = combineLatest([this.anime$, this.transloco.langChanges$]).pipe(
        map(([anime, lang]) => getAnimeName(anime, lang)),
    );
    lastAiredEpisode$ = this.anime$.pipe(map(getLastAiredEpisode));

    userRate$ = this.animeId$.pipe(
        switchMap((animeId) => this.store.select(selectPlayerUserRate(animeId))),
    );
    isWatched$ = combineLatest([this.episode$, this.userRate$]).pipe(
        map(([episode, userRate]) => isEpisodeWatched(episode, userRate)),
    );
    isRewatching$ = this.userRate$.pipe(
        map((userRate) => userRate?.status === 'rewatching'),
    );

    authorPreferences$ = this.animeId$.pipe(
        switchMap((animeId) => this.store.select(selectAuthorPreferencesByAnime(animeId))),
    );
    kindPreferences$ = this.animeId$.pipe(
        switchMap((animeId) => this.store.select(selectKindPreferencesByAnime(animeId))),
    );
    domainPreferences$ = this.animeId$.pipe(
        switchMap((animeId) => this.store.select(selectDomainPreferencesByAnime(animeId))),
    );

    currentVideo$ = new ReplaySubject<VideoInfoInterface>(1);
    currentKind$ = new ReplaySubject<VideoKindEnum>(1);

    episodeVideos$ = combineLatest([this.videos$, this.episode$]).pipe(
        map(([videos, episode]) => filterByEpisode(videos, episode)),
    );

    comments$ = combineLatest([this.animeId$, this.episode$]).pipe(
        switchMap(([animeId, episode]) => this.store.select(selectPlayerComments(animeId, episode))),
    );
    isShownAllComments$ = combineLatest([this.animeId$, this.episode$]).pipe(
        switchMap(([animeId, episode]) => this.store.select(selectPlayerIsShownAllComments(animeId, episode))),
    );
    isCommentsLoading$ = combineLatest([this.animeId$, this.episode$]).pipe(
        switchMap(([animeId, episode]) => this.store.select(selectPlayerIsCommentsLoading(animeId, episode))),
    );

    constructor(
        @Inject(SHIKIMORI_DOMAIN_TOKEN)
        readonly shikimoriDomain$: Observable<string>,
        private store: Store,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title,
        private platform: Platform,
        private breakpointObserver: BreakpointObserver,
        private actions$: Actions,
        private toast: ToastController,
        private transloco: TranslocoService,
        private modalController: ModalController,
    ) {}

    ngOnInit(): void {
        this.animeId$.pipe(
            tap((animeId) => {
                this.store.dispatch(findVideosAction({ animeId }));
                this.store.dispatch(getAnimeInfoAction({ animeId }));
            }),
            untilDestroyed(this),
        ).subscribe();

        this.episodeVideos$.pipe(
            filter(({ length = 0 }) => length > 0),
            withLatestFrom(
                this.authorPreferences$,
                this.domainPreferences$,
                this.kindPreferences$,
                this.isPreferencesToggleOn$,
            ),
            map(([videos, author, domain, kind, isPreferencesToggleOn]) => {
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

                return relevantVideos || videos;
            }),
            map((relevantVideos) => relevantVideos?.[0]),
            tap((video) => this.onVideoChange(video, false)),
            untilDestroyed(this),
        ).subscribe();

        combineLatest([
            this.anime$,
            this.episode$,
        ]).pipe(
            distinctUntilChanged((
                [prevAnime, prevEpisode],
                [nextAnime, nextEpisode],
            ) => prevAnime.id === nextAnime.id && prevEpisode === nextEpisode),
            filter(([anime]) => !!anime?.name),
            tap(([anime, episode]) => {
                this.changeTitle(anime, episode);

                this.store.dispatch(getTopicsAction({ animeId: anime.id, episode, revalidate: false }));
                this.store.dispatch(getCommentsAction({ animeId: anime.id, episode, page: 1, limit: 30 }));
                this.store.dispatch(visitAnimePageAction({ anime, episode }));
            }),
            untilDestroyed(this),
        ).subscribe();

        this.actions$.pipe(
            ofType(watchAnimeSuccessAction),
            tap(({ userRate }) => this.onEpisodeChange(userRate.episodes + 1)),
            untilDestroyed(this),
        ).subscribe();

        this.platform.resize
            .pipe(
                debounceTime(100),
                tap(() => this.onResize()),
                untilDestroyed(this),
            )
            .subscribe();

        this.onResize();
    }

    private onResize(): void {
        this.isOrientationPortraitSubject$.next(this.platform.isPortrait());
    }

    private async updateUserPreferences(): Promise<void> {
        const anime = await firstValueFrom(this.anime$);
        const currentVideo = await firstValueFrom(this.currentVideo$);
        const { author, kind, url } = currentVideo;
        const domain = getDomain(url);

        this.store.dispatch(updatePlayerPreferencesAction({ animeId: anime.id, author, kind, domain }));
    }

    async changeTitle(anime: AnimeBriefInfoInterface, episode: number): Promise<void> {
        // TODO: добавить селектор из настроек предпочтений названия аниме, а не просто по языку пользователя
        const animeName = await firstValueFrom(this.animeName$);
        const isSeries = getLastAiredEpisode(anime) > 1;
        const translationKey = isSeries
            ? 'PLAYER_MODULE.PLAYER_PAGE.PAGE_TITLE.SERIES'
            : 'PLAYER_MODULE.PLAYER_PAGE.PAGE_TITLE.MOVIE';
        const title = this.transloco.translate(translationKey, { title: animeName, episode });

        this.title.setTitle(title);
    }

    onVideoChange(video: VideoInfoInterface, isShouldUpdatePref = true): void {
        this.currentVideo$.next(video);
        this.currentKind$.next(video.kind);

        if (isShouldUpdatePref) {
            void this.updateUserPreferences();
        }
    }

    onKindChange(kind: VideoKindEnum): void {
        this.currentKind$.next(kind);
    }

    onEpisodeChange(episode: number): void {
        this.animeId$.pipe(
            take(1),
            withLatestFrom(this.lastAiredEpisode$),
            filter(([_, lastAiredEpisode]) => episode <= lastAiredEpisode && episode > 0),
            tap(([animeId]) => this.router.navigate(['/player', animeId, episode])),
            untilDestroyed(this),
        ).subscribe();
    }

    // TODO: для модалок нужно придумать какой-то сервис - слишком много бойлерплейта
    async onOpenVideoSelectorModal(): Promise<void> {
        const componentProps = {
            videos: await firstValueFrom(this.episodeVideos$),
            selectedKind: await firstValueFrom(this.currentKind$),
            selectedVideo: await firstValueFrom(this.currentVideo$),
        };
        const { VideoSelectorModalComponent } = await import('@app/modules/player/components/video-selector-modal');

        const modal = await this.modalController.create({
            component: VideoSelectorModalComponent,
            componentProps,
        });

        modal.present();

        const { data: newSelected, role } = await modal.onDidDismiss<VideoInfoInterface>();

        if (role === 'submit') {
            this.onVideoChange(newSelected);
        }
    }

    async onWatch(episode: number, isUnwatch = false): Promise<void> {
        const anime = await firstValueFrom(this.anime$);
        const userRate = await firstValueFrom(this.userRate$);
        const isRewarch = await firstValueFrom(this.isRewatching$) || userRate?.status === 'completed';
        const watchedEpisode = isUnwatch ? episode - 1 : episode;

        this.store.dispatch(watchAnimeAction({ animeId: anime.id, episode: watchedEpisode, isRewarch }));

        void this.updateUserPreferences();
    }

    onShowMoreComments(): void {
        const isShownAll = true;

        combineLatest([
            this.animeId$,
            this.episode$,
        ]).pipe(
            take(1),
            tap(([animeId, episode]) => this.store.dispatch(setIsShownAllAction({ animeId, episode, isShownAll }))),
            untilDestroyed(this),
        ).subscribe();
    }

    async onCommentSend(commentText: string): Promise<void> {
        const animeId = await firstValueFrom(this.animeId$);
        const episode = await firstValueFrom(this.episode$);

        this.store.dispatch(sendCommentAction({ animeId, episode, commentText }));
    }

    async onVideoUpload(video: VideoInfoInterface): Promise<void> {
        const animeId = await firstValueFrom(this.animeId$);

        this.store.dispatch(uploadVideoAction({ animeId, video }));
    }

    togglePlayerMode(): void {
        this.store.dispatch(togglePlayerModeAction());
    }
}
