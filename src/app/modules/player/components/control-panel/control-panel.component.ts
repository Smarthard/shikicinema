import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { InputCustomEvent } from '@ionic/angular';
import {
    IonButton,
    IonButtons,
    IonIcon,
    IonInput,
    IonItem,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    IonTitle,
    IonToolbar,
} from '@ionic/angular/standalone';

import { EpisodeSelectorComponent } from '@app/modules/player/components/episode-selector/episode-selector.component';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { adjustEpisode } from '@app/shared/utils/adjust-episode.function';

@Component({
    selector: 'app-control-panel',
    standalone: true,
    imports: [
        EpisodeSelectorComponent,
        IonIcon,
        IonButton,
        IonButtons,
        IonItem,
        IonInput,
        IonTitle,
        IonToolbar,
        IonPicker,
        IonPickerColumn,
        IonPickerColumnOption,
    ],
    templateUrl: './control-panel.component.html',
    styleUrl: './control-panel.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelComponent {
    @HostBinding('class.control-panel')
    private controlPanelClass = true;

    @ViewChild('episodeInputEl', { static: true })
    private _episodeInputEl: IonInput;

    private _episodes: number[];
    private _maxEpisode: number;

    @Input({ required: true })
    set episodes(episodes: number[]) {
        this._episodes = episodes;
        this._maxEpisode = episodes[episodes.length - 1];
    }

    get episodes(): number[] {
        return this._episodes;
    }

    @Input()
    selected: number;

    @Input()
    userRate: UserAnimeRate;

    @Input()
    isWatched = false;

    @Input()
    isRewatching = false;

    @Input()
    isMinified = false;

    @Output()
    selection = new EventEmitter<number>();

    @Output()
    watch = new EventEmitter<number>();

    @Output()
    openVideoModal = new EventEmitter<void>();

    get maxEpisode(): number {
        return this._maxEpisode;
    }

    get maxWatchedEpisode(): number {
        return this.userRate?.episodes || 0;
    }

    private adjustEpisode(episode): number {
        return adjustEpisode(episode, this.selected, this.maxEpisode);
    }

    onEpisodeControlsClick(selectedEpisode: number, type: 'forward' | 'backward'): void {
        const episode = this.adjustEpisode(selectedEpisode + (type === 'forward' ? 1 : -1));

        this.onEpisodeChange(episode);
    }

    onEpisodeInput(event: InputCustomEvent): void {
        const { value } = event?.target;
        const episode = this.adjustEpisode(value);

        this._episodeInputEl.value = episode;
        this.onEpisodeChange(episode);
    }

    onEpisodeChange(episode: number): void {
        if (episode !== this.selected) {
            this.selection.emit(episode);
        }
    }

    onWatch(episode: number): void {
        this.watch.emit(episode);
    }
}
