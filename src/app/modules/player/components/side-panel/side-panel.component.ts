import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    inject,
    input,
    output,
} from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { VideoInfoInterface } from '@app/modules/player/types';

@Component({
    selector: 'app-side-panel',
    standalone: true,
    imports: [
        IonButton,
        IonIcon,
        TranslocoPipe,
        RouterLink,
    ],
    templateUrl: './side-panel.component.html',
    styleUrl: './side-panel.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'side-panel',
        '[class.side-panel--minified]': 'isMinified()',
    },
})
export class SidePanelComponent {
    private readonly modalController = inject(ModalController);

    anime = input.required<AnimeBriefInfoInterface>();
    episode = input.required<number>();

    isLoading = input(true);
    isMinified = input(false);

    uploaded = output<VideoInfoInterface>();

    async onOpenUploadModal(): Promise<void> {
        const cssClass = 'side-panel__upload-modal';
        const componentProps = {
            anime: this.anime(),
            episode: this.episode(),
        };
        const { VideoUploadModalComponent } = await import('@app/modules/player/components/video-upload-modal');

        const modal = await this.modalController.create({
            component: VideoUploadModalComponent,
            componentProps,
            cssClass,
        });

        modal.present();

        const { data: uploadedVideo, role } = await modal.onDidDismiss<VideoInfoInterface>();

        if (role === 'submit') {
            this.uploaded.emit(uploadedVideo);
        }
    }
}
