import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { IonImg, IonModal } from '@ionic/angular/standalone';

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
    private imageViewerModalClass = true;

    @Input() imageSrc: string;
}
