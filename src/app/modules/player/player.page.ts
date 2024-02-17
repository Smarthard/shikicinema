import { ActivatedRoute } from '@angular/router';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, skipWhile, take, tap } from 'rxjs/operators';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { BehaviorSubject, Observable, ReplaySubject, combineLatest } from 'rxjs';
import { FilterByEpisodePipe } from '@app/shared/pipes/filter-by-episode/filter-by-episode.pipe';
import { VideoInfoInterface } from '@app/modules/player/types';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';
import { combineLatestInit } from 'rxjs/internal/observable/combineLatest';
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

    animeId$: Observable<string>;
    episode$: Observable<number>;

    isVideosLoading$: Observable<boolean>;
    videos$: Observable<VideoInfoInterface[]>;

    isAnimeLoading$: Observable<boolean>;
    anime$: Observable<AnimeBriefInfoInterface>;

    currentVideo: VideoInfoInterface;
    currentKind$ = new BehaviorSubject<VideoKindEnum>(VideoKindEnum.DUBBING);
    episodeVideos$ = new ReplaySubject<VideoInfoInterface[]>(1);

    constructor(
        private store: Store,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.animeId$ = this.route.params.pipe(map(({ animeId }) => animeId));
        this.episode$ = this.route.params.pipe(map(({ episode }) => Number(episode)));

        this.animeId$.pipe(
            tap((animeId) => {
                this.isVideosLoading$ = this.store.select(selectPlayerVideosLoading(animeId));
                this.videos$ = this.store.select(selectPlayerVideos(animeId));

                this.isAnimeLoading$ = this.store.select(selectPlayerAnimeLoading(animeId));
                this.anime$ = this.store.select(selectPlayerAnime(animeId));
            }),
            tap((animeId) => {
                this.store.dispatch(findVideosAction({ animeId }));
                this.store.dispatch(getAnimeInfoAction({ animeId }));
            }),
            untilDestroyed(this),
        ).subscribe();

        combineLatest([this.videos$, this.episode$])
            .pipe(
                tap(([videos, targetEpisode]) => {
                    const videosByEpisode = videos?.filter(({ episode }) => episode === targetEpisode);
                    this.episodeVideos$.next(videosByEpisode);
                }),
                untilDestroyed(this),
            )
            .subscribe();

        this.episodeVideos$
            .pipe(
                skipWhile(({ length = 0 }) => length <= 0),
                take(1),
                tap((videos) => this.currentVideo = videos?.[0]),
                untilDestroyed(this),
            )
            .subscribe();
    }

    onVideoChange(video: VideoInfoInterface): void {
        this.currentVideo = video;
    }

    onKindChange(kind: VideoKindEnum): void {
        this.currentKind$.next(kind);
    }
}
