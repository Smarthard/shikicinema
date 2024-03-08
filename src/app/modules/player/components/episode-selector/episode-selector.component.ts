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
import { IonIcon } from '@ionic/angular/standalone';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';

import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';

@UntilDestroy()
@Component({
    selector: 'app-episode-selector',
    standalone: true,
    imports: [
        IonIcon,
        SkeletonBlockModule,
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
    private _episodes: number[];
    private _maxEpisode: number;

    @ViewChild('episodesWrapper', { static: true })
    episodesWrapperEl: ElementRef<HTMLDivElement>;

    @ViewChildren('episodeEl')
    episodesEl: QueryList<ElementRef<HTMLSpanElement>>;

    readonly episodesSkeleton = new Array(24);

    get maxEpisode(): number {
        return this._maxEpisode;
    }

    @Input({ required: true })
    set episodes(episodes: number[]) {
        this._episodes = episodes;
        this._maxEpisode = episodes.length - 1;
    }

    get episodes(): number[] {
        return this._episodes;
    }

    @Input({ required: true })
    set selected(episode: number) {
        this.selectedSubject$.next(episode);
    }

    get selected(): number {
        return this.selectedSubject$.value;
    }

    @Output()
    selection = new EventEmitter<number>();

    private scrollToEpisode(episode: number) {
        const episodeIndex = episode - 1;
        const element = this.episodesEl?.get(episodeIndex)?.nativeElement;
        const episodeRect = element?.getBoundingClientRect();
        const wrapperRect = this.episodesWrapperEl.nativeElement.getBoundingClientRect();
        const isInView = episodeRect?.top >= wrapperRect.top &&
            episodeRect?.left >= wrapperRect.left &&
            episodeRect?.bottom <= wrapperRect.bottom &&
            episodeRect?.right <= wrapperRect.right;

        if (!isInView && element) {
            element.scrollIntoView({ inline: 'center', behavior: 'auto' });
        }
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

    changeEpisode(episode: number, maxEpisode: number): void {
        if (episode > 0 && episode <= maxEpisode) {
            this.onEpisodeSelect(episode);
        }
    }
}