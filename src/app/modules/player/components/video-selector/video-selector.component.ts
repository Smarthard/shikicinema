import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
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
import {
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonItem,
    IonLabel,
} from '@ionic/angular/standalone';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    combineLatestWith,
    filter,
    map,
    tap,
    withLatestFrom,
} from 'rxjs/operators';

import { FilterByAuthorPipe } from '@app/shared/pipes/filter-by-author/filter-by-author.pipe';
import { GetColorForSelectablePipe } from '@app/shared/pipes/get-color-for-selectable/get-color-for-selectable.pipe';
import { GetUrlDomainPipe } from '@app/shared/pipes/get-url-domain/get-url-domain.pipe';
import { HasQualitiesPipe } from '@app/modules/player/pipes/has-qualities.pipe';
import { IsSameAuthorPipe } from '@app/shared/pipes/is-same-author/is-same-author.pipe';
import { IsSameVideoPipe } from '@app/shared/pipes/is-same-video/is-same-video.pipe';
import { SortByDomainModule } from '@app/shared/pipes/sort-by-domain/sort-by-domain.module';
import { VideoInfoInterface, VideoQualityEnum } from '@app/modules/player/types';
import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';

@UntilDestroy()
@Component({
    selector: 'app-video-selector',
    standalone: true,
    imports: [
        AsyncPipe,
        IonAccordionGroup,
        IonAccordion,
        IonItem,
        IonLabel,
        GetUrlDomainPipe,
        IonButton,
        FilterByAuthorPipe,
        GetColorForSelectablePipe,
        IsSameAuthorPipe,
        IsSameVideoPipe,
        SortByDomainModule,
        HasQualitiesPipe,
    ],
    templateUrl: './video-selector.component.html',
    styleUrl: './video-selector.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoSelectorComponent implements OnInit {
    @HostBinding('class.video-selector')
    private videoSelectorClass = true;

    readonly VideoQualityEnum = VideoQualityEnum;

    authors$: Observable<Set<string>>;
    selected$ = new ReplaySubject<VideoInfoInterface>(1);
    videos$ = new ReplaySubject<VideoInfoInterface[]>(1);
    openedByDefaultAuthors$ = new BehaviorSubject<string[]>([]);

    @Input()
    set selected(selected: VideoInfoInterface) {
        this.selected$.next(selected);
    }

    @Input()
    set videos(videos: VideoInfoInterface[]) {
        this.videos$.next(videos);
    }

    @Output()
    selection = new EventEmitter<VideoInfoInterface>;

    constructor(private readonly transloco: TranslocoService) {}

    ngOnInit(): void {
        this.selected$.pipe(
            filter((selected) => !!selected),
            combineLatestWith(this.transloco.selectTranslate('GLOBAL.VIDEO.AUTHORS.DEFAULT_NAME')),
            map(([selected, defaultAuthor]) => cleanAuthorName(selected.author, defaultAuthor)),
            withLatestFrom(this.openedByDefaultAuthors$),
            tap(([cleanedAuthorName, previouslySelected]) => this.openedByDefaultAuthors$.next([
                ...previouslySelected,
                cleanedAuthorName,
            ])),
            untilDestroyed(this),
        ).subscribe();

        this.authors$ = this.videos$.pipe(
            combineLatestWith(this.transloco.selectTranslate('GLOBAL.VIDEO.AUTHORS.DEFAULT_NAME')),
            map(([videos, defaultAuthor]) => new Set(
                videos
                    ?.map(({ author }) => author)
                    ?.map((author) => cleanAuthorName(author, defaultAuthor))
                    ?.sort(),
            )),
        );
    }

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
