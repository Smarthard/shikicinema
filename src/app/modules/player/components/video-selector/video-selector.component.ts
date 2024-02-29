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

import { FilterByAuthorPipe } from '@app/shared/pipes/filter-by-author/filter-by-author.pipe';
import { GetColorForSelectablePipe } from '@app/shared/pipes/get-color-for-selectable/get-color-for-selectable.pipe';
import { GetUrlDomainPipe } from '@app/shared/pipes/get-url-domain/get-url-domain.pipe';
import { IsSameAuthorPipe } from '@app/shared/pipes/is-same-author/is-same-author.pipe';
import { IsSameVideoPipe } from '@app/shared/pipes/is-same-video/is-same-video.pipe';
import { TranslocoService } from '@ngneat/transloco';
import { VideoInfoInterface } from '@app/modules/player/types';
import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';

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
    ],
    templateUrl: './video-selector.component.html',
    styleUrl: './video-selector.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoSelectorComponent {
    @HostBinding('class.video-selector')
    private videoSelectorClass = true;

    private readonly DEFAULT_AUTHOR_NAME = this.transloco.translate('GLOBAL.VIDEO.AUTHORS.DEFAULT_NAME');

    private _videos: VideoInfoInterface[];
    private _selected: VideoInfoInterface;

    authors$ = new ReplaySubject<string[]>(1);
    openedByDefaultAuthors$ = new BehaviorSubject<string[]>([]);

    @Input()
    set selected(selected: VideoInfoInterface) {
        if (selected) {
            const previouslySelected = this.openedByDefaultAuthors$.value;
            const cleanedAuthorName = cleanAuthorName(selected.author, this.DEFAULT_AUTHOR_NAME);

            this.openedByDefaultAuthors$.next([...previouslySelected, cleanedAuthorName]);
            this._selected = selected;
        }
    }

    get selected(): VideoInfoInterface {
        return this._selected;
    }

    @Input()
    set videos(videos: VideoInfoInterface[]) {
        const authors = new Set(
            videos
                ?.map(({ author }) => author)
                ?.map((author) => cleanAuthorName(author, this.DEFAULT_AUTHOR_NAME)),
        );

        this._videos = videos;
        this.authors$.next([...authors]);
    }

    get videos(): VideoInfoInterface[] {
        return this._videos;
    }

    @Output()
    selection = new EventEmitter<VideoInfoInterface>;

    constructor(private readonly transloco: TranslocoService) {}
}
