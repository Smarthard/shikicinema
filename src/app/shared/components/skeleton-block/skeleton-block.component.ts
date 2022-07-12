import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-skeleton-block',
    templateUrl: './skeleton-block.component.html',
    styleUrls: ['./skeleton-block.component.scss'],
})
export class SkeletonBlockComponent {
    @Input()
    height: string;

    @Input()
    width: string;
}
