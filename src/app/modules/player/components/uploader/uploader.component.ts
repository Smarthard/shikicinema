import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    input,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { ImageCardComponent } from '@app/shared/components/image-card';
import { KODIK_UPLOADER } from '@app/shared/types';
import { UploaderInterface } from '@app/modules/player/types';
import { isWellKnownUploaderPipe } from '@app/modules/player/pipes/is-known-uploader.pipe';
import { longNumberToHumanReadable } from '@app/shared/utils/human-readable';
import { provideShikimoriImageLoader } from '@app/shared/providers';

@Component({
    selector: 'app-uploader',
    standalone: true,
    imports: [
        isWellKnownUploaderPipe,
        TranslocoPipe,
        ImageCardComponent,
    ],
    providers: [
        provideShikimoriImageLoader(32),
    ],
    templateUrl: './uploader.component.html',
    styleUrl: './uploader.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'uploader',
    },
})
export class UploaderComponent {
    readonly uploader = input<UploaderInterface>();

    readonly id = computed(() => this.uploader()?.id);
    readonly avatar = computed(() => this.uploader()?.avatar || '/assets/shikimori-404.png');
    readonly name = computed(() => this.uploader()?.name);
    readonly link = computed(() => this.uploader()?.url);

    readonly rawCount = computed(() => this.uploader()?.count ?? 0);
    readonly readableUploads = computed(() => longNumberToHumanReadable(this.rawCount()));
    readonly count = computed(() => this.readableUploads()?.number);
    readonly suffix = computed(() => this.readableUploads()?.suffix);

    readonly isKodik = computed(() => this.id() === KODIK_UPLOADER);
}
