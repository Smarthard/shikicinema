import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';


@UntilDestroy()
@Component({
    selector: 'app-episode-selector',
    standalone: true,
    imports: [
        IonRippleEffect,
        NgScrollbarModule,
    ],
    templateUrl: './episode-selector.component.html',
    styleUrl: './episode-selector.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeSelectorComponent implements AfterViewInit {
    @HostBinding('class.episode-selector')
    private episodeSelectorClass = true;

    private selectedSubject$ = new BehaviorSubject<number>(1);

    @ViewChild('episodesScrollbar', { static: true })
    episodesScrollbar: NgScrollbar;

    @ViewChildren('episodeEl')
    episodesEl: QueryList<ElementRef<HTMLSpanElement>>;

    readonly episodesSkeleton = new Array<number>(50);

    @Input({ required: true })
    episodes: number[];

    @Input({ required: true })
    set selected(episode: number) {
        this.selectedSubject$.next(episode);
    }

    @Input({ required: true })
    maxEpisode: number;

    @Input()
    maxWatchedEpisode: number;

    get selected(): number {
        return this.selectedSubject$.value;
    }

    @Output()
    selection = new EventEmitter<number>();

    private scrollToEpisode(episode: number) {
        this.episodesScrollbar.scrollToElement(`#episode-${episode}`, { duration: 800 });
    }

    ngAfterViewInit(): void {
        combineLatest([this.episodesEl.changes, this.selectedSubject$])
            .pipe(
                tap(([, episode]) => this.scrollToEpisode(episode)),
                untilDestroyed(this),
            ).subscribe();
    }

    onEpisodeSelect(episode: number): void {
        this.selection.emit(episode);
    };
}
