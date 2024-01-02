import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: ['./image-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ImageCardComponent {
    @Input()
    imageUrl: string;

    @Input()
    name: string;

    @Input()
    height = '10rem';

    @Input()
    width = '7rem';

    @Input()
    backgroundSize = 'auto';

    @Output()
    imageLoad = new EventEmitter<void>();

    isLoading = true;

    onImageLoad(): void {
        this.isLoading = false;
        this.imageLoad.emit();
    }
}
