import { ActivatedRoute, Router } from '@angular/router';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    distinctUntilChanged,
    filter,
    map,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { ReplaySubject, combineLatest } from 'rxjs';
import { Title } from '@angular/platform-browser';
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
    ) {}

    ngOnInit() {
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
}
