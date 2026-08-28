import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    ViewEncapsulation,
    computed,
    input,
    output,
    viewChild,
} from '@angular/core';
import {
    InputCustomEvent,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
} from '@ionic/angular';
import { NgTemplateOutlet } from '@angular/common';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { EpisodeSelectorComponent } from '@app/modules/player/components/episode-selector/episode-selector.component';
import { PlayerModeType } from '@app/store/settings/types';
import { SidePanelComponent } from '@app/modules/player/components/side-panel/side-panel.component';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { VideoInfoInterface } from '@app/modules/player/types';
import { adjustEpisode } from '@app/shared/utils/adjust-episode.function';
import { getLastAiredEpisode } from '@app/modules/player/utils';

@Component({
    selector: 'app-control-panel',
    standalone: true,
    imports: [
        EpisodeSelectorComponent,
        SidePanelComponent,
        NgTemplateOutlet,
        IonIcon,
        IonButton,
        IonItem,
        IonInput,
    ],
    templateUrl: './control-panel.component.html',
    styleUrl: './control-panel.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelComponent {
    @HostBinding('class.control-panel')
    protected controlPanelClass = true;

    private readonly _episodeInputEl = viewChild<IonInput>('episodeInputEl');

    selected = input.required<number>();
    anime = input.required<AnimeBriefInfoInterface>();

    userRate = input<UserAnimeRate>();
    maxEpisode = input<number>(1);
    isLoading = input(true);
    isWatched = input(false);
    showSidePanel = input<boolean>();
    isRewatching = input(false);
    isMinified = input<boolean>();
    playerMode = input<PlayerModeType>('compact');

    selection = output<number>();
    watch = output<number>();
    openVideoModal = output<void>();
    uploaded = output<VideoInfoInterface>();
    togglePlayerMode = output<void>();

    maxAiredEpisode = computed(() => {
        const anime = this.anime();

        return anime?.id ? getLastAiredEpisode(anime) : 0;
    });
    maxWatchedEpisode = computed(() => this.userRate()?.episodes || 0);
    changePlayerModeIcon = computed(() => this.playerMode() === 'full' ? 'contract-outline' : 'expand-outline');
    showVideoSelectionBtn = computed(() => this.isMinified() || this.playerMode() === 'full');

    private adjustEpisode(episode: number): number {
        return adjustEpisode(episode, this.selected(), this.maxEpisode());
    }

    onEpisodeControlsClick(selectedEpisode: number, type: 'forward' | 'backward'): void {
        const episode = this.adjustEpisode(selectedEpisode + (type === 'forward' ? 1 : -1));

        this.onEpisodeChange(episode);
    }

    onEpisodeInput(event: InputCustomEvent): void {
        const target = event?.target;
        const value = (target as unknown as IonInput)?.value;
        const episode = Number(value);

        if (!Number.isNaN(episode)) {
            const episodeInputEl = this._episodeInputEl();

            if (episodeInputEl) {
                episodeInputEl.value = String(this.adjustEpisode(episode));
            }
            this.onEpisodeChange(episode);
        }
    }

    onEpisodeChange(episode: number): void {
        if (episode !== this.selected()) {
            this.selection.emit(episode);
        }
    }

    onWatch(episode: number): void {
        this.watch.emit(episode);
    }
}
