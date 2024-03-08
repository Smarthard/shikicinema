import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input, Output,
    ViewEncapsulation,
} from '@angular/core';
import {
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonItem,
    IonLabel,
} from '@ionic/angular/standalone';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take, tap } from 'rxjs/operators';

import { FilterByAuthorPipe } from '@app/shared/pipes/filter-by-author/filter-by-author.pipe';
import { GetColorForSelectablePipe } from '@app/shared/pipes/get-color-for-selectable/get-color-for-selectable.pipe';
import { GetUrlDomainPipe } from '@app/shared/pipes/get-url-domain/get-url-domain.pipe';
import { IsSameAuthorPipe } from '@app/shared/pipes/is-same-author/is-same-author.pipe';
import { IsSameVideoPipe } from '@app/shared/pipes/is-same-video/is-same-video.pipe';
import { SortByDomainModule } from '@app/shared/pipes/sort-by-domain/sort-by-domain.module';
import { TranslocoService } from '@ngneat/transloco';
import { VideoInfoInterface } from '@app/modules/player/types';
import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';

@UntilDestroy()
@Component({
    selector: 'app-video-selector',
    standalone: true,
    imports: [
        NgForOf,
        AsyncPipe,
        IonAccordionGroup,
        IonAccordion,
        IonItem,
        IonLabel,
        NgIf,
        GetUrlDomainPipe,
        IonButton,
        FilterByAuthorPipe,
        GetColorForSelectablePipe,
        IsSameAuthorPipe,
        IsSameVideoPipe,
        SortByDomainModule,
    ],
    templateUrl: './video-selector.component.html',
    styleUrl: './video-selector.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoSelectorComponent {
    @HostBinding('class.video-selector')
    private videoSelectorClass = true;

    private _videos: VideoInfoInterface[];
    private _selected: VideoInfoInterface;

    authors$ = new ReplaySubject<string[]>(1);
    openedByDefaultAuthors$ = new BehaviorSubject<string[]>([]);

    private _afterDefaultAuthorSelected(fn: (defaultAuthor: string) => void): void {
        this.transloco.selectTranslate('GLOBAL.VIDEO.AUTHORS.DEFAULT_NAME')
            .pipe(
                take(1),
                tap(fn),
                untilDestroyed(this),
            )
            .subscribe();
    }

    @Input()
    set selected(selected: VideoInfoInterface) {
        this._afterDefaultAuthorSelected((defaultAuthor) => {
            if (selected) {
                const previouslySelected = this.openedByDefaultAuthors$.value;
                const cleanedAuthorName = cleanAuthorName(selected.author, defaultAuthor);

                this.openedByDefaultAuthors$.next([...previouslySelected, cleanedAuthorName]);
                this._selected = selected;
            }
        });
    }

    get selected(): VideoInfoInterface {
        return this._selected;
    }

    @Input()
    set videos(videos: VideoInfoInterface[]) {
        this._afterDefaultAuthorSelected((defaultAuthor) => {
            const authors = new Set(
                videos
                    ?.map(({ author }) => author)
                    ?.map((author) => cleanAuthorName(author, defaultAuthor))
                    ?.sort(),
            );

            this._videos = videos;
            this.authors$.next([...authors]);
        });
    }

    get videos(): VideoInfoInterface[] {
        return this._videos;
    }

    @Output()
    selection = new EventEmitter<VideoInfoInterface>;

    constructor(private readonly transloco: TranslocoService) {}

    onSelectionChange(selectedVideo: VideoInfoInterface): void {
        this.selection.emit(selectedVideo);
    }

    onAuthorSectionToggle(author: string): void {
        const previouslySelected = this.openedByDefaultAuthors$.value;
        const isClosingClick = previouslySelected.includes(author);
        const filteredAuthor = previouslySelected.filter((previous) => previous !== author);
        const withAuthor = [...previouslySelected, author];

        this.openedByDefaultAuthors$.next(isClosingClick ? filteredAuthor : withAuthor);
    }
}
