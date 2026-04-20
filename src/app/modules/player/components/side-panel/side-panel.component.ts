import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    inject,
    input,
    output,
} from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { AsyncPipe } from '@angular/common';
import { ToUploaderPipe } from '@app/modules/player/pipes';
import { UploaderComponent } from '@app/modules/player/components/uploader/uploader.component';
import { VideoInfoInterface } from '@app/modules/player/types';
import { selectDomainFilters } from '@app/store/settings/selectors/settings.selectors';

@Component({
    selector: 'app-side-panel',
    standalone: true,
    imports: [
        IonButton,
        IonIcon,
        AsyncPipe,
        RouterLink,
        UploaderComponent,
        ToUploaderPipe,
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
    private readonly store = inject(Store);

    private readonly domainFilters = this.store.selectSignal(selectDomainFilters);
    readonly showDomainFilters = computed(() => this.domainFilters()?.length > 0);

    readonly anime = input.required<AnimeBriefInfoInterface>();
    readonly episode = input.required<number>();
    readonly video = input<VideoInfoInterface>();

    readonly isLoading = input(true);
    readonly isMinified = input(false);
    readonly isDomainFiltersActive = input(true);

    readonly uploaded = output<VideoInfoInterface>();
    readonly filtersToggle = output<boolean>();

    readonly funnelIcon = computed(() => this.isDomainFiltersActive() ? 'funnel' : 'funnel-outline');
    readonly uploader = computed(() => this.video()?.uploader);

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
