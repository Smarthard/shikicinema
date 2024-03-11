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
    IonIcon,
    IonInput,
    IonItem,
} from '@ionic/angular/standalone';

import { EpisodeSelectorComponent } from '@app/modules/player/components/episode-selector/episode-selector.component';
import { adjustEpisode } from '@app/shared/utils/adjust-episode.function';

@Component({
    selector: 'app-control-panel',
    standalone: true,
    imports: [
        EpisodeSelectorComponent,
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

    @Output()
    selection = new EventEmitter<number>();

    get maxEpisode(): number {
        return this._maxEpisode;
    }

    onEpisodeInput(event: InputCustomEvent): void {
        const { value } = event?.target;
        const episode = adjustEpisode(value, this.selected, this.maxEpisode);

        this._episodeInputEl.value = episode;

        if (episode !== this.selected) {
            this.selection.emit(episode);
        }
    }

    onEpisodeChange(episode: number): void {
        this.selection.emit(episode);
    }
}