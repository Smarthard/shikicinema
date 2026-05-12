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
} from '@ionic/angular/standalone';
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

    maxEpisode = input<number>(1);
    userRate = input<UserAnimeRate>();
    anime = input<AnimeBriefInfoInterface>();
    isLoading = input(true);
    isWatched = input(false);
    showSidePanel = input(false);
    isRewatching = input(false);
    isMinified = input(false);
    playerMode = input<PlayerModeType>('compact');

    selection = output<number>();
    watch = output<number>();
    openVideoModal = output<void>();
    uploaded = output<VideoInfoInterface>();
    togglePlayerMode = output<void>();

    maxAiredEpisode = computed(() => getLastAiredEpisode(this.anime()));
    maxWatchedEpisode = computed(() => this.userRate()?.episodes || 0);
    changePlayerModeIcon = computed(() => this.playerMode() === 'full' ? 'contract-outline' : 'expand-outline');
    showVideoSelectionBtn = computed(() => this.isMinified() || this.playerMode() === 'full');

    private adjustEpisode(episode): number {
        return adjustEpisode(episode, this.selected(), this.maxEpisode());
    }

    onEpisodeControlsClick(selectedEpisode: number, type: 'forward' | 'backward'): void {
        const episode = this.adjustEpisode(selectedEpisode + (type === 'forward' ? 1 : -1));

        this.onEpisodeChange(episode);
    }

    onEpisodeInput(event: InputCustomEvent): void {
        const { value } = event?.target;
        const episode = this.adjustEpisode(value);

        this._episodeInputEl().value = episode;
        this.onEpisodeChange(episode);
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
