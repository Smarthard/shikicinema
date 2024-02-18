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
import {
    filter,
    map,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';

import { ReplaySubject, combineLatest } from 'rxjs';
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

    animeId$ = this.route.params.pipe<string>(map(({ animeId }) => animeId));
    episode$ = this.route.params.pipe(map(({ episode }) => Number(episode)));

    isVideosLoading$ = this.animeId$.pipe<boolean>(
        switchMap((animeId) => this.store.select(selectPlayerVideosLoading(animeId))),
    );
    videos$ = this.animeId$.pipe(
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
    ) {}

    ngOnInit() {
        this.animeId$.pipe(
            tap((animeId) => {
                this.store.dispatch(findVideosAction({ animeId }));
                this.store.dispatch(getAnimeInfoAction({ animeId }));
            }),
            untilDestroyed(this),
        ).subscribe();

        this.episodeVideos$
            .pipe(
                filter(({ length = 0 }) => length > 0),
                take(1),
                map((videos) => videos?.[0]),
                tap((video) => this.onVideoChange(video)),
                untilDestroyed(this),
            )
            .subscribe();
    }

    onVideoChange(video: VideoInfoInterface): void {
        this.currentVideo$.next(video);
        this.currentKind$.next(video.kind);
    }

    onKindChange(kind: VideoKindEnum): void {
        this.currentKind$.next(kind);
    }
}
