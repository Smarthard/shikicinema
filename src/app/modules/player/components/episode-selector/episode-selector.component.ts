import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    ViewEncapsulation,
    computed,
    effect,
    input,
    output,
    viewChild,
    viewChildren,
} from '@angular/core';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { NgScrollbar } from 'ngx-scrollbar';


@Component({
    selector: 'app-episode-selector',
    standalone: true,
    imports: [
        IonRippleEffect,
        NgScrollbar,
    ],
    templateUrl: './episode-selector.component.html',
    styleUrl: './episode-selector.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeSelectorComponent {
    @HostBinding('class.episode-selector')
    private episodeSelectorClass = true;

    readonly episodesScrollbar = viewChild<NgScrollbar>('episodesScrollbar');
    readonly episodesEl = viewChildren<ElementRef>('episodeEl');

    readonly episodesSkeleton = new Array<number>(50);

    selected = input.required<number>();
    maxEpisode = input.required<number>();
    maxWatchedEpisode = input<number>();

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
