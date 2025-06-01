import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-skeleton-block',
    templateUrl: './skeleton-block.component.html',
    styleUrls: ['./skeleton-block.component.scss'],
    standalone: true,
    imports: [
        NgStyle,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SkeletonBlockComponent {
    @Input({ required: true })
    height: string;

    @Input({ required: true })
    width: string;
}
