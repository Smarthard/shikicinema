import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    ViewEncapsulation,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
    untracked,
} from '@angular/core';
import {
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonItem,
    IonLabel,
} from '@ionic/angular/standalone';
import { TranslocoService } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { FilterByAuthorPipe } from '@app/shared/pipes/filter-by-author/filter-by-author.pipe';
import { GetColorForSelectablePipe } from '@app/shared/pipes/get-color-for-selectable/get-color-for-selectable.pipe';
import { GetUrlDomainPipe } from '@app/shared/pipes/get-url-domain/get-url-domain.pipe';
import { HasQualitiesPipe } from '@app/modules/player/pipes/has-qualities.pipe';
import { IsSameAuthorPipe } from '@app/shared/pipes/is-same-author/is-same-author.pipe';
import { IsSameVideoPipe } from '@app/shared/pipes/is-same-video/is-same-video.pipe';
import { PlayerKindDisplayMode } from '@app/store/settings/types/player-kind-display-mode.type';
import { SortByDomainPipe } from '@app/shared/pipes/sort-by-domain/sort-by-domain.pipe';
import { VideoInfoInterface, VideoQualityEnum } from '@app/modules/player/types';
import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';


@Component({
    selector: 'app-video-selector',
    standalone: true,
    imports: [
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
        SortByDomainPipe,
        HasQualitiesPipe,
        UpperCasePipe,
    ],
    templateUrl: './video-selector.component.html',
    styleUrl: './video-selector.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoSelectorComponent {
    @HostBinding('class.video-selector')
    private videoSelectorClass = true;

    private readonly transloco = inject(TranslocoService);

    readonly VideoQualityEnum = VideoQualityEnum;
    readonly defaultAuthorName = toSignal<string>(this.transloco.selectTranslate('GLOBAL.VIDEO.AUTHORS.DEFAULT_NAME'));

    selected = input<VideoInfoInterface>();
    videos = input<VideoInfoInterface[]>();
    kindDisplayMode = input<PlayerKindDisplayMode>();

    selection = output<VideoInfoInterface>();

    readonly openedByDefaultAuthors = signal<string[]>([]);

    readonly authors = computed(() => {
        const defaultAuthorName = this.defaultAuthorName();
        const authors = this.videos()
            ?.map(({ author }) => author)
            ?.map((author) => cleanAuthorName(author, defaultAuthorName))
            ?.sort();

        return new Set(authors);
    });

    readonly selectedChangeEffect = effect(() => {
        const selected = this.selected();
        /* нужно обновить сигнал, если поменялись видео */
        this.videos();

        untracked(() => {
            if (selected) {
                const defaultAuthorName = this.defaultAuthorName();
                const cleaned = cleanAuthorName(selected.author, defaultAuthorName);

                this.openedByDefaultAuthors.update((prevAuthors) => [...prevAuthors, cleaned]);
            }
        });
    });

    onSelectionChange(selectedVideo: VideoInfoInterface): void {
        this.selection.emit(selectedVideo);
    }

    onAuthorSectionToggle(author: string): void {
        const previouslySelected = this.openedByDefaultAuthors();
        const isClosingClick = previouslySelected.includes(author);
        const filteredAuthor = previouslySelected.filter((previous) => previous !== author);
        const withAuthor = [...previouslySelected, author];

        this.openedByDefaultAuthors.set(isClosingClick ? filteredAuthor : withAuthor);
    }
}
