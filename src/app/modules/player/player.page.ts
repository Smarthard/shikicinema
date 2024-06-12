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
import { ReplaySubject, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { VideoInfoInterface } from '@app/modules/player/types';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';
import { filterByEpisode } from '@app/shared/utils/filter-by-episode.function';
import { findVideosAction, getAnimeInfoAction } from '@app/modules/player/store/actions';
import {
    selectPlayerAnime,
    selectPlayerAnimeLoading,
    selectPlayerVideos,
    selectPlayerVideosLoading,
} from '@app/modules/player/store/selectors/player.selectors';

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
            map((videos) => videos?.[0]),
            tap((video) => this.onVideoChange(video)),
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

    changeTitle(anime: AnimeBriefInfoInterface, episode: number): void {
        this.title.setTitle(`${anime.russian || anime.name} | серия ${episode}`);
    }

    onVideoChange(video: VideoInfoInterface): void {
        this.currentVideo$.next(video);
        this.currentKind$.next(video.kind);
    }

    onKindChange(kind: VideoKindEnum): void {
        this.currentKind$.next(kind);
    }

    onEpisodeChange(episode: number): void {
        this.animeId$.pipe(
            take(1),
            tap((animeId) => {
                void this.router.navigate(['/player', animeId, episode]);
            }),
            untilDestroyed(this),
        ).subscribe();
    }

    onOpenVideoSelectorModal(): void {
        this.videoSelectorModal.present();
    }
}
