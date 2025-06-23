import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
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
import { VideoInfoInterface, VideoKindEnum } from '@app/modules/player/types';
import { VideoSelectorComponent } from '@app/modules/player/components/video-selector/video-selector.component';

// TODO: модалка не хочет переводиться на сигналы - перепроверить позже
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
})
export class VideoSelectorModalComponent extends IonModal {
    @HostBinding('class.video-selector-modal')
    private videoSelectorModalClass = true;

    private readonly _modalController = inject(ModalController);

    private _selectedKind: VideoKindEnum;
    private _selectedVideo: VideoInfoInterface;

    @Input()
    videos: VideoInfoInterface[];

    @Input()
    lastAiredEpisode: number;

    @Input()
    set selectedKind(kind: VideoKindEnum) {
        this._selectedKind = kind;
    }

    get selectedKind(): VideoKindEnum {
        return this._selectedKind;
    }

    @Input()
    set selectedVideo(video: VideoInfoInterface) {
        this._selectedVideo = video;
    }

    get selectedVideo(): VideoInfoInterface {
        return this._selectedVideo;
    }

    onKindChange(kind: VideoKindEnum): void {
        this._selectedKind = kind;
    }

    onVideoChange(video: VideoInfoInterface): void {
        this._selectedVideo = video;
    }

    cancel(): void {
        // TODO: выяснить почему this.dismiss() кидает ошибку
        this._modalController.dismiss(null, 'cancel');
    }

    submit(): void {
        this._modalController.dismiss(this.selectedVideo, 'submit');
    }
}
