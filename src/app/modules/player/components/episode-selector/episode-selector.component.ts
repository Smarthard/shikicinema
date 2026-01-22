import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    ViewEncapsulation,
    afterEveryRender,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { RepeatPipe } from 'ngxtension/repeat-pipe';
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
                if (!this.isLoading()) {
                    this.scrollToEpisode(this.selected());
                }
            },
        });
    }

    private scrollToEpisode(episode: number): void {
        this.scrollbar()?.scrollToElement(`#episode-${episode}`, { duration: 800 });
    }

    onEpisodeSelect(episode: number): void {
        this.selection.emit(episode);
    };
}
