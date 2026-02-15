import { AsyncPipe, DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    HostBinding,
    ViewEncapsulation,
    computed,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import {
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
})
export class PlayerComponent {
    @HostBinding('class.player')
    protected playerClass = true;

    private readonly destroyRef = inject(DestroyRef);

    private _sourceLoading = signal(true);
    private _sourceLoading$ = toObservable(this._sourceLoading);

    loading = input(true);
    source = input<string>();
    nextEpisodeAt = input<Date | string | number>();

    loaded = output<boolean>();
    timedOut = output<boolean>();

    @HostBinding('class.skeleton')
    readonly isLoading = computed(() => this._sourceLoading() || this.loading());

    timeout$: Observable<boolean>;

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
        this._sourceLoading.set(true);

        this.timeout$ = this._getTimeout(10_000);
    });

    onLoad(): void {
        this.loaded.emit(true);
        this._sourceLoading.set(false);
    }

    onTimeout(): void {
        this.timedOut.emit(true);
    }
}
