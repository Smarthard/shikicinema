import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: ['./image-card.component.scss'],
})
export class ImageCardComponent {
    @Input()
    imageUrl: string;

    @Input()
    link = '#';

    @Input()
    height = '10rem';

    @Input()
    width = '7rem';

    isLoading = true;

    onImageLoad(): void {
        this.isLoading = false;
    }
}
