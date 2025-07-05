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

import { AuthorAvailabilityWarningPipe } from '@app/modules/player/pipes';
import { FilterByKindPipe } from '@app/shared/pipes/filter-by-kind/filter-by-kind.pipe';
import { GetActiveKindsPipe } from '@app/shared/pipes/get-active-kinds/get-active-kinds.pipe';
import { KindSelectorComponent } from '@app/modules/player/components/kind-selector/kind-selector.component';
import { PlayerKindDisplayMode } from '@app/store/settings/types';
import { VideoInfoInterface, VideoKindEnum } from '@app/modules/player/types';
import { VideoSelectorComponent } from '@app/modules/player/components/video-selector/video-selector.component';

@Component({
    selector: 'app-video-selector-modal',
    standalone: true,
    imports: [
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonIcon,
        AuthorAvailabilityWarningPipe,
        FilterByKindPipe,
        GetActiveKindsPipe,
        TranslocoPipe,
        VideoSelectorComponent,
        KindSelectorComponent,
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
    public videos: Signal<VideoInfoInterface[]>;
    public episodeVideos: Signal<VideoInfoInterface[]>;
    public kindDisplayMode: Signal<PlayerKindDisplayMode>;
    public hasUnfilteredVideos: Signal<boolean>;
    public lastAiredEpisode: Signal<number>;

    public isDomainFilterOn: WritableSignal<boolean>;
    public selectedKind: WritableSignal<VideoKindEnum>;
    public selectedVideo: WritableSignal<VideoInfoInterface>;

    onKindChange(kind: VideoKindEnum): void {
        this.selectedKind.set(kind);
    }

    onVideoChange(video: VideoInfoInterface): void {
        this.selectedVideo.set(video);
    }

    onToggleDomainFilters(): void {
        this.isDomainFilterOn.set(false);
    }

    cancel(): void {
        // TODO: выяснить почему this.dismiss() кидает ошибку
        this._modalController.dismiss(null, 'cancel');
    }

    submit(): void {
        this._modalController.dismiss(this.selectedVideo(), 'submit');
    }
}
