import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    ViewEncapsulation,
    input,
} from '@angular/core';
import { IonImg, IonModal } from '@ionic/angular';

@Component({
    selector: 'app-image-viewer-modal',
    standalone: true,
    imports: [IonImg],
    templateUrl: './image-viewer-modal.component.html',
    styleUrl: './image-viewer-modal.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageViewerModalComponent extends IonModal {
    @HostBinding('class.image-viewer-modal')
    protected imageViewerModalClass = true;

    imageSrc = input<string>();
}
