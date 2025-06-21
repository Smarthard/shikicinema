import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    ViewEncapsulation,
    computed,
    effect,
    inject,
    input,
    output,
    viewChild,
    viewChildren,
} from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { EpisodeSelectorItemComponent } from '@app/modules/player/components/episode-selector-item';

@Component({
    selector: 'app-episode-selector',
    standalone: true,
    imports: [
        NgScrollbar,
        NgxTippyModule,
        EpisodeSelectorItemComponent,
    ],
    templateUrl: './episode-selector.component.html',
    styleUrl: './episode-selector.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeSelectorComponent {
    @HostBinding('class.episode-selector')
    private episodeSelectorClass = true;

    private readonly transloco = inject(TranslocoService);

    readonly episodesScrollbar = viewChild<NgScrollbar>('episodesScrollbar');
    readonly episodesEl = viewChildren<ElementRef>('episodeEl');

    readonly episodesSkeleton = new Array<number>(50);

    readonly notAiredText = toSignal(
        this.transloco.selectTranslate('PLAYER_MODULE.PLAYER_PAGE.PLAYER.EPISODE_IS_NOT_AIRED'),
    );

    selected = input.required<number>();
    maxEpisode = input.required<number>();
    maxAiredEpisode = input<number>();
    maxWatchedEpisode = input<number>();
    isLoading = input(true);

    selection = output<number>();

    episodes = computed(() => new Array(this.maxEpisode()).fill(0).map((_, index) => index + 1));

    private scrollToEpisode(episode: number) {
        this.episodesScrollbar()?.scrollToElement(`#episode-${episode}`, { duration: 800 });
    }

    onEpisodeSelectionChangeEffect = effect(() => {
        const selectedEpisode = this.selected();
        const episodesEl = this.episodesEl();
        const scrollbarEl = this.episodesScrollbar();

        if (scrollbarEl && episodesEl?.length) {
            this.scrollToEpisode(selectedEpisode);
        }
    });

    onEpisodeSelect(episode: number): void {
        this.selection.emit(episode);
    };
}
