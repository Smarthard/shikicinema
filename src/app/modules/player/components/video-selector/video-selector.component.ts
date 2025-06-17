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
import { IonAccordionGroup } from '@ionic/angular/standalone';
import { NgScrollbar } from 'ngx-scrollbar';
import { TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { FilterByAuthorPipe } from '@app/shared/pipes/filter-by-author/filter-by-author.pipe';
import { PlayerKindDisplayMode } from '@app/store/settings/types/player-kind-display-mode.type';
import { VideoInfoInterface } from '@app/modules/player/types';
import { VideoSelectorItemComponent } from '@app/modules/player/components/video-selector-item';
import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';


@Component({
    selector: 'app-video-selector',
    standalone: true,
    imports: [
        IonAccordionGroup,
        FilterByAuthorPipe,
        NgScrollbar,
        VideoSelectorItemComponent,
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
        /*
            нужно обновить сигнал, если поменялись видео
            иначе сломается открывашка групп
         */
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
