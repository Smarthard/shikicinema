import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';

import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';
import { UrlSanitizerPipe } from '@app/shared/pipes/url-sanitizer/url-sanitizer.pipe';

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
export class PlayerComponent {
    @HostBinding('class.player')
    private playerClass = true;

    private _source: string;
    private _sourceLoading$ = new BehaviorSubject(true);

    readonly isSourceLoading$ = this._sourceLoading$.asObservable();

    @Input()
    loading = true;

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
