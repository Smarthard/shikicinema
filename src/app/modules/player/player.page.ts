import { ActivatedRoute } from '@angular/router';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { pluck, tap } from 'rxjs/operators';

import { findVideosAction } from '@app/modules/player/store/actions';

@UntilDestroy()
@Component({
    selector: 'app-player',
    templateUrl: './player.page.html',
    styleUrl: './player.page.css',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerPage implements OnInit {
    constructor(
        private store: Store,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.params.pipe(
            pluck('animeId'),
            tap((animeId) => this.store.dispatch(findVideosAction({ animeId }))),
            untilDestroyed(this),
        ).subscribe();
    }
}
