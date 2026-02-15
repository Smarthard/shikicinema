import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    ViewEncapsulation,
    afterEveryRender,
    effect,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { RepeatPipe } from 'ngxtension/repeat-pipe';
import { TranslocoService } from '@jsverse/transloco';
import { effectOnceIf } from 'ngxtension/effect-once-if'
import { toSignal } from '@angular/core/rxjs-interop';

import { EpisodeSelectorItemComponent } from '@app/modules/player/components/episode-selector-item';

@Component({
    selector: 'app-episode-selector',
    standalone: true,
    imports: [
        NgScrollbar,
        NgxTippyModule,
        EpisodeSelectorItemComponent,
        RepeatPipe,
    ],
    templateUrl: './episode-selector.component.html',
    styleUrl: './episode-selector.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeSelectorComponent {
    @HostBinding('class.episode-selector')
    protected episodeSelectorClass = true;

    private readonly transloco = inject(TranslocoService);

    private readonly scrollbar = viewChild(NgScrollbar);

    private readonly isEpisodeChanged = signal(false);

    readonly notAiredText = toSignal(
        this.transloco.selectTranslate('PLAYER_MODULE.PLAYER_PAGE.PLAYER.EPISODE_IS_NOT_AIRED'),
    );

    selected = input.required<number>();
    maxEpisode = input.required<number>();
    maxAiredEpisode = input<number>();
    maxWatchedEpisode = input<number>();
    isLoading = input(true);

    selection = output<number>();

    constructor() {
        afterEveryRender({
            read: () => {
                if (!this.isLoading() && this.isEpisodeChanged()) {
                    this.isEpisodeChanged.set(false);
                    this.scrollToEpisode(this.selected());
                }
            },
        });
    }

    readonly afterLoadedEffect = effectOnceIf(
        () => !this.isLoading(),
        () => setTimeout(() => this.scrollToEpisode(this.selected()), 100),
    );

    readonly selectedEpisodeChangedEffect = effect(() => {
        this.isEpisodeChanged.set(Number.isInteger(this.selected()));
    });

    private scrollToEpisode(episode: number): void {
        this.scrollbar()?.scrollToElement(`#episode-${episode}`, { duration: 800 });
    }

    onEpisodeSelect(episode: number): void {
        this.selection.emit(episode);
    };
}
