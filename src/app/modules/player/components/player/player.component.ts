import { AsyncPipe } from '@angular/common';
import {
    BehaviorSubject,
    Observable,
    combineLatest,
    filter,
    map,
    race,
    tap,
    timer,
} from 'rxjs';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { shareReplay, take } from 'rxjs/operators';

import { UrlSanitizerPipe } from '@app/shared/pipes/url-sanitizer/url-sanitizer.pipe';

@UntilDestroy()
@Component({
    selector: 'app-player',
    standalone: true,
    imports: [
        UrlSanitizerPipe,
        AsyncPipe,
        TranslocoPipe,
    ],
    templateUrl: './player.component.html',
    styleUrl: './player.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements OnInit {
    @HostBinding('class.player')
    private playerClass = true;

    private _source: string;
    private _sourceLoading$ = new BehaviorSubject(true);
    private _outerLoading$ = new BehaviorSubject(true);

    @HostBinding('class.skeleton')
    readonly isLoading$ = combineLatest([
        this._sourceLoading$,
        this._outerLoading$,
    ]).pipe(map(([isSource, isOuter]) => isSource || isOuter));

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
            untilDestroyed(this),
        );
    }

    ngOnInit(): void {
        this._sourceLoading$.pipe(
            filter(Boolean),
            tap(() => this.timeout$ = this._getTimeout(10_000)),
            untilDestroyed(this),
        ).subscribe();
    }

    @Input()
    set loading(loading: boolean) {
        this._outerLoading$.next(loading);
    }

    @Input()
    set source(source: string) {
        this._source = source;
        this.loaded.emit(false);
        this._sourceLoading$.next(true);
    }

    get source(): string {
        return this._source;
    }

    @Output()
    loaded = new EventEmitter<boolean>();

    @Output()
    timedOut = new EventEmitter<boolean>();

    onLoad(): void {
        this.loaded.emit(true);
        this._sourceLoading$.next(false);
    }

    onTimeout(): void {
        this.timedOut.emit(true);
    }
}
