import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: ['./image-card.component.scss'],
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

    @Output()
    imageLoad = new EventEmitter<void>();

    isLoading = true;

    onImageLoad(): void {
        this.isLoading = false;
        this.imageLoad.emit();
    }
}
