import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    ViewEncapsulation,
    input,
} from '@angular/core';

@Component({
    selector: 'app-skeleton-block',
    templateUrl: './skeleton-block.component.html',
    styleUrls: ['./skeleton-block.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SkeletonBlockComponent {
    @HostBinding('class.skeleton-block')
    private skeletonBlockClass = true;

    height = input.required<string>();
    width = input.required<string>();

    borderRadius = input<string>(null);
}
