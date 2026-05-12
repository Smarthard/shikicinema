import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    inject,
    output,
} from '@angular/core';
import { IonIcon, ModalController } from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';

import { Store } from '@ngrx/store';
import { VideoInfoInterface } from '@app/modules/player/types';
import {
    selectCurrentPlayerAnime,
    selectCurrentPlayerEpisode,
} from '@app/modules/player/store/selectors/player.selectors';
import { uploadVideoAction } from '@app/store/shikicinema/actions/upload-video.action';

@Component({
    selector: 'app-upload-button',
    imports: [
        IonIcon,
        TranslocoPipe,
    ],
    templateUrl: './upload-button.component.html',
    styleUrl: './upload-button.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'tabindex': '0',
        'class': 'upload-btn',
        '(click)': 'onOpenUploadModal()',
    },
})
export class UploadButtonComponent {
    private readonly modalController = inject(ModalController);
    private readonly store = inject(Store);

    readonly anime = this.store.selectSignal(selectCurrentPlayerAnime);
    readonly episode = this.store.selectSignal(selectCurrentPlayerEpisode);

    readonly uploaded = output<VideoInfoInterface>();

    async onOpenUploadModal(): Promise<void> {
        const cssClass = 'upload-btn__modal';
        const componentProps = {
            anime: this.anime,
            episode: this.episode,
        };
        const { VideoUploadModalComponent } = await import('@app/modules/player/components/video-upload-modal');

        const modal = await this.modalController.create({
            component: VideoUploadModalComponent,
            componentProps,
            cssClass,
        });

        modal.present();

        const { data: video, role } = await modal.onDidDismiss<VideoInfoInterface>();

        if (role === 'submit') {
            const animeId = this.anime().id;

            this.store.dispatch(uploadVideoAction({ animeId, video: video as VideoInfoInterface }));
        }
    }
}
