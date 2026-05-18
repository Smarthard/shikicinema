import { AsyncPipe, DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ViewEncapsulation,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import {
    EMPTY,
    Observable,
    filter,
    map,
    race,
    tap,
    timer,
} from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { shareReplay, take } from 'rxjs/operators';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { UrlSanitizerPipe } from '@app/shared/pipes/url-sanitizer/url-sanitizer.pipe';


@Component({
    selector: 'app-player',
    standalone: true,
    imports: [
        UrlSanitizerPipe,
        AsyncPipe,
        TranslocoPipe,
        DatePipe,
    ],
    templateUrl: './player.component.html',
    styleUrl: './player.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'player',
        '[class.skeleton]': 'isLoading()',
    },
})
export class PlayerComponent {
    private readonly destroyRef = inject(DestroyRef);

    protected isLoading = signal(true);

    private _sourceLoading$ = toObservable(this.isLoading);

    source = input<string>();
    showNextEpisodeAt = input(false);
    nextEpisodeAt = input<Date | string | number>();

    loaded = output<boolean>();
    timedOut = output<boolean>();

    timeout$: Observable<boolean> = EMPTY;

    private _getTimeout(timeoutMs: number): Observable<boolean> {
        return race(
            this._sourceLoading$.pipe(
                filter((loading) => !loading),
                take(1),
                map(() => false),
            ),

            timer(timeoutMs).pipe(
                take(1),
                map(() => true),
            ),
        ).pipe(
            tap((isTimedOut) => isTimedOut && this.onTimeout()),
            shareReplay(1),
            takeUntilDestroyed(this.destroyRef),
        );
    }

    sourceChangedEffect = explicitEffect([this.source], () => {
        this.loaded.emit(false);
        this.isLoading.set(true);

        this.timeout$ = this._getTimeout(10_000);
    });

    onLoad(): void {
        this.loaded.emit(true);
        this.isLoading.set(false);
    }

    onTimeout(): void {
        this.timedOut.emit(true);
    }
}
