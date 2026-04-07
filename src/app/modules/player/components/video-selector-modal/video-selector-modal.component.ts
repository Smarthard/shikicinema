import {
    ChangeDetectionStrategy,
    Component,
    Signal,
    ViewEncapsulation,
    WritableSignal,
    inject,
} from '@angular/core';
import {
    IonButton,
    IonButtons,
    IonIcon,
    IonModal,
    IonTitle,
    IonToolbar,
    ModalController,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';

import { PlayerSelectorComponent } from '@app/modules/player/components/player-selector';
import { ResourceIdType } from '@app/shared/types';
import { VideoInfoInterface, VideoKindEnum } from '@app/modules/player/types';

@Component({
    selector: 'app-video-selector-modal',
    standalone: true,
    imports: [
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonIcon,
        TranslocoPipe,
        PlayerSelectorComponent,
    ],
    templateUrl: './video-selector-modal.component.html',
    styleUrl: './video-selector-modal.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'video-selector-modal',
    },
})
export class VideoSelectorModalComponent extends IonModal {
    private readonly _modalController = inject(ModalController);

    // TODO: перекидывание напрямую сигналов, а не их значений не выглядит хорошей идеей
    public selectedVideo!: WritableSignal<VideoInfoInterface>;
    public selectedKind!: WritableSignal<VideoKindEnum>;
    public isFilterDomains!: WritableSignal<boolean>;

    public animeId!: Signal<ResourceIdType>;
    public episode!: Signal<number>;
    public lastAiredEpisode!: Signal<number>;
    public isLoading!: Signal<boolean>;
    public videos!: Signal<VideoInfoInterface[]>;

    onKindChange(kind: VideoKindEnum): void {
        this.selectedKind.set(kind);
    }

    onVideoChange(video: VideoInfoInterface): void {
        this.selectedVideo.set(video);
    }

    onToggleDomainFilters(): void {
        this.isFilterDomains.set(false);
    }

    cancel(): void {
        // TODO: выяснить почему this.dismiss() кидает ошибку
        this._modalController.dismiss(null, 'cancel');
    }

    submit(): void {
        this._modalController.dismiss(this.selectedVideo(), 'submit');
    }
}
