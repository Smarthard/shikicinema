import { ActivatedRoute } from '@angular/router';
import {
    ChangeDetectionStrategy,
    Component, HostBinding,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, pluck, tap } from 'rxjs/operators';

import { Observable, ReplaySubject } from 'rxjs';
import { VideoInfoInterface } from '@app/modules/player/types';
import { findVideosAction } from '@app/modules/player/store/actions';
import { selectPlayerVideos, selectPlayerVideosLoading } from '@app/modules/player/store/selectors/player.selectors';

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

    isVideosLoading$: Observable<boolean>;
    videos$: Observable<VideoInfoInterface[]>;
    currentVideo$: Observable<VideoInfoInterface>;

    constructor(
        private store: Store,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.params.pipe(
            pluck('animeId'),
            tap((animeId) => {
                this.isVideosLoading$ = this.store.select(selectPlayerVideosLoading(animeId));
                this.videos$ = this.store.select(selectPlayerVideos(animeId));
                this.currentVideo$ = this.videos$.pipe(map((video) => video?.[0]));
            }),
            tap((animeId) => this.store.dispatch(findVideosAction({ animeId }))),
            untilDestroyed(this),
        ).subscribe();
    }
}
