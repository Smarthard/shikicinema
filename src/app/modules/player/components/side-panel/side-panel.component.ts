import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { TranslocoPipe } from '@ngneat/transloco';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { VideoInfoInterface } from '@app/modules/player/types';

@Component({
    selector: 'app-side-panel',
    standalone: true,
    imports: [
        IonButton,
        IonIcon,
        TranslocoPipe,
    ],
    templateUrl: './side-panel.component.html',
    styleUrl: './side-panel.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent {
    @HostBinding('class.side-panel')
    private sidePanelClass = true;

    @Input()
    anime: AnimeBriefInfoInterface;

    @Input()
    episode: number;

    @Input()
    isLoading: boolean = true;

    @Input()
    @HostBinding('class.side-panel--minified')
    isMinified: boolean = false;

    @Output()
    uploaded = new EventEmitter<VideoInfoInterface>();

    constructor(
        private readonly modalController: ModalController,
    ) {}

    async onOpenUploadModal(): Promise<void> {
        const cssClass = 'side-panel__upload-modal';
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

        const { data: uploadedVideo, role } = await modal.onDidDismiss<VideoInfoInterface>();

        if (role === 'submit') {
            this.uploaded.emit(uploadedVideo);
        }
    }
}
