import { AsyncPipe } from '@angular/common';
import {
    BehaviorSubject,
    combineLatest,
    map,
    tap,
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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';
import { UrlSanitizerPipe } from '@app/shared/pipes/url-sanitizer/url-sanitizer.pipe';

@UntilDestroy()
@Component({
    selector: 'app-player',
    standalone: true,
    imports: [
        UrlSanitizerPipe,
        SkeletonBlockModule,
        AsyncPipe,
    ],
    templateUrl: './player.component.html',
    styleUrl: './player.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements OnInit {
    @HostBinding('class.player')
    private playerClass = true;

    @HostBinding('class.skeleton')
    private skeletonClass = true;

    private _source: string;
    private _sourceLoading$ = new BehaviorSubject(true);
    private _outerLoading$ = new BehaviorSubject(true);

    readonly isLoading$ = combineLatest([
        this._sourceLoading$,
        this._outerLoading$,
    ]).pipe(map(([isSource, isOuter]) => isSource || isOuter));

    ngOnInit(): void {
        this.isLoading$
            .pipe(
                untilDestroyed(this),
                tap((isLoading) => this.skeletonClass = isLoading),
            )
            .subscribe();
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

    onLoad(): void {
        this.loaded.emit(true);
        this._sourceLoading$.next(false);
    }
}
