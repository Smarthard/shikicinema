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
import { Store } from '@ngrx/store';
import { TranslocoPipe } from '@jsverse/transloco';

import { PlayerSelectorComponent } from '@app/modules/player/components/player-selector';
import { ResourceIdType } from '@app/shared/types';
import { VideoInfoInterface, VideoKindEnum } from '@app/modules/player/types';
import { getDomain } from '@app/shared/utils/get-domain.function';
import { updatePlayerPreferencesAction } from '@app/store/settings/actions/settings.actions';

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
    private readonly modalController = inject(ModalController);
    private readonly store = inject(Store);

    // TODO: перекидывание напрямую сигналов, а не их значений не выглядит хорошей идеей
    public selectedVideo!: WritableSignal<VideoInfoInterface>;
    public selectedKind!: WritableSignal<VideoKindEnum>;
    public isFilterDomains!: WritableSignal<boolean>;

    public animeId!: Signal<ResourceIdType>;
    public episode!: Signal<number>;
    public lastAiredEpisode!: Signal<number>;
    public maxEpisode!: Signal<number>;
    public isLoading!: Signal<boolean>;
    public videos!: Signal<VideoInfoInterface[]>;

    private updateUserPreferences(): void {
        const currentVideo = this.selectedVideo();

        if (currentVideo) {
            const animeId = this.animeId();
            const { author, kind, url } = currentVideo;
            const domain = getDomain(url);

            this.store.dispatch(updatePlayerPreferencesAction({ animeId, author, kind, domain }));
        }
    }

    onKindChange(kind: VideoKindEnum): void {
        this.selectedKind.set(kind);
    }

    onVideoChange(video: VideoInfoInterface, isShouldUpdatePref = true): void {
        this.selectedVideo.set(video);

        if (isShouldUpdatePref) {
            this.updateUserPreferences();
        }
    }

    onToggleDomainFilters(): void {
        this.isFilterDomains.set(false);
    }

    cancel(): void {
        // TODO: выяснить почему this.dismiss() кидает ошибку
        this.modalController.dismiss(null, 'cancel');
    }

    submit(): void {
        this.modalController.dismiss(this.selectedVideo(), 'submit');
    }
}
