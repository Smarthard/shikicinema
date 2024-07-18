import {
    ChangeDetectionStrategy,
    Component,
    ComponentRef,
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
    IonModal,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    IonTitle,
    IonToolbar,
    ModalController,
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
        IonButtons,
        IonItem,
        IonInput,
        IonTitle,
        IonToolbar,
        IonPicker,
        IonPickerColumn,
        IonPickerColumnOption,
        IonModal,
    ],
    providers: [ModalController],
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

    @ViewChild('episodeSelectorModal')
    private _episodeSelectorModal: IonModal;

    private _episodes: number[];
    private _maxEpisode: number;

    // TODO: refactor this (or better) entire modal
    modalEpisode: number;

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
    isMinified = false;

    @Output()
    selection = new EventEmitter<number>();

    @Output()
    watch = new EventEmitter<number>();

    get maxEpisode(): number {
        return this._maxEpisode;
    }

    private adjustEpisode(episode): number {
        return adjustEpisode(episode, this.selected, this.maxEpisode);
    }

    constructor(
        private readonly _modalController: ModalController,
    ) {}

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

    async onOpenEpisodeSelectorModal(): Promise<void> {
        const cssClass = 'control-panel__episode-selector--modal';
        const componentProps = {
            episodes: this.episodes,
            selected: this.selected,
        };
        const { EpisodeSelectorModalComponent } = await import('@app/shared/components/episode-selector-modal');

        const modal = await this._modalController.create({
            component: EpisodeSelectorModalComponent,
            componentProps,
            cssClass,
        });

        modal.present();

        const { data: newSelected, role } = await modal.onDidDismiss<number>();

        if (role === 'submit') {
            this.onEpisodeChange(newSelected);
        }
    }
}
