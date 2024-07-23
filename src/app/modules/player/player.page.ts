import { Actions, ofType } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { IonModal } from '@ionic/angular/common';
import { Platform } from '@ionic/angular';
import { ReplaySubject, combineLatest, firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular/standalone';
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
import { NoPreferenceSymbol } from '@app/store/settings/types';
import { VideoInfoInterface } from '@app/modules/player/types';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';
import { filterByEpisode } from '@app/shared/utils/filter-by-episode.function';
import { filterVideosByPreferences } from '@app/modules/player/utils/filter-videos-by-preferences.function';
import {
    findVideosAction,
    getAnimeInfoAction,
    watchAnimeAction,
    watchAnimeSuccessAction,
} from '@app/modules/player/store/actions';
import { getDomain } from '@app/shared/utils/get-domain.function';
import { getLastAiredEpisode, isEpisodeWatched } from '@app/modules/player/utils';
import {
    selectAuthorPreferencesByAnime,
    selectDomainPreferencesByAnime,
    selectKindPreferencesByAnime,
} from '@app/store/settings/selectors/settings.selectors';
import {
    selectPlayerAnime,
    selectPlayerAnimeLoading,
    selectPlayerUserRate,
    selectPlayerVideos,
    selectPlayerVideosLoading,
} from '@app/modules/player/store/selectors/player.selectors';
import { updatePlayerPreferencesAction } from '@app/store/settings/actions/settings.actions';


@UntilDestroy()
@Component({
    selector: 'app-player-page',
    templateUrl: './player.page.html',
    styleUrl: './player.page.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerPage implements OnInit {
    @HostBinding('class.player-page')
    private playerPageClass = true;

    @ViewChild('videoSelectorModal')
    videoSelectorModal: IonModal;

    private isMobileSubject$ = new ReplaySubject<boolean>(1);
    private isOrientationPortraitSubject$ = new ReplaySubject<boolean>(1);

    readonly isMobile$ = this.isMobileSubject$.asObservable();
    readonly isSmallScreen$ = this.breakpointObserver.observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
    ]).pipe(map(({ matches }) => matches));

    readonly isControlPanelMinified$ = combineLatest([
        this.isMobile$,
        this.isOrientationPortraitSubject$,
        this.isSmallScreen$,
    ]).pipe(
        map(([isMobile, isPortrait, isSmallScreen]) => isMobile && isPortrait || !isMobile && isSmallScreen),
    );

    readonly isVideoSelectionHidden$ = combineLatest([
        this.isMobile$,
        this.isSmallScreen$,
    ]).pipe(map(([isMobile, isSmall]) => isMobile || isSmall));

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

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title,
        private platform: Platform,
        private breakpointObserver: BreakpointObserver,
        private actions$: Actions,
        private toast: ToastController,
        private transloco: TranslocoService,
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
            ),
            map(([videos, author, domain, kind]) => {
                const relevantVideos = filterVideosByPreferences(videos, author, domain, kind);

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
            filter(([anime]) => !!anime?.name),
            tap(([anime, episode]) => this.changeTitle(anime, episode)),
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
        this.isMobileSubject$.next(this.platform.is('mobile') || this.platform.is('mobileweb'));
    }

    private async updateUserPreferences(): Promise<void> {
        const anime = await firstValueFrom(this.anime$);
        const currentVideo = await firstValueFrom(this.currentVideo$);
        const { author, kind, url } = currentVideo;
        const domain = getDomain(url);

        this.store.dispatch(updatePlayerPreferencesAction({ animeId: anime.id, author, kind, domain }));
    }

    changeTitle(anime: AnimeBriefInfoInterface, episode: number): void {
        this.title.setTitle(`${anime.russian || anime.name} | серия ${episode}`);
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
            tap(async ([animeId, lastAiredEpisode]) => {
                if (episode <= lastAiredEpisode && episode > 0) {
                    void this.router.navigate(['/player', animeId, episode]);
                }
            }),
            untilDestroyed(this),
        ).subscribe();
    }

    onOpenVideoSelectorModal(): void {
        this.videoSelectorModal.present();
    }

    async onWatch(episode: number, isUnwatch = false): Promise<void> {
        const anime = await firstValueFrom(this.anime$);
        const userRate = await firstValueFrom(this.userRate$);
        const isRewarch = await firstValueFrom(this.isRewatching$) || userRate?.status === 'completed';
        const watchedEpisode = isUnwatch ? episode - 1 : episode;

        this.store.dispatch(watchAnimeAction({ animeId: anime.id, episode: watchedEpisode, isRewarch }));

        void this.updateUserPreferences();
    }
}
