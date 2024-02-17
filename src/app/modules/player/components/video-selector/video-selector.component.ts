import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component, EventEmitter,
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
import { ReplaySubject } from 'rxjs';

import { FilterByAuthorPipe } from '@app/shared/pipes/filter-by-author/filter-by-author.pipe';
import { GetUrlDomainPipe } from '@app/shared/pipes/get-url-domain/get-url-domain.pipe';
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

    authors$ = new ReplaySubject<string[]>(1);

    @Input()
    set videos(videos: VideoInfoInterface[]) {
        const authors = new Set(
            videos
                ?.map(({ author }) => author)
                ?.map(cleanAuthorName),
        );

        this._videos = videos;
        this.authors$.next([...authors]);
    }

    get videos(): VideoInfoInterface[] {
        return this._videos;
    }

    @Output()
    selection = new EventEmitter<VideoInfoInterface>;
}
