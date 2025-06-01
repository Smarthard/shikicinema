import { AsyncPipe, NgStyle } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';

import { AbstractImageCardComponent } from '@app/shared/components/abstract-image-card/abstract-image-card.component';
import { IsImageWidthLargerPipe } from '@app/shared/pipes/is-image-width-larger/is-image-width-larger.pipe';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: ['./image-card.component.scss'],
    standalone: true,
    imports: [
        NgStyle,
        AsyncPipe,
        IsImageWidthLargerPipe,
        SkeletonBlockComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ImageCardComponent extends AbstractImageCardComponent {
    @HostBinding('class.image-card')
    imageCardClass = true;

    @Input()
    height = '100%';

    @Input()
    width = 'auto';

    @Input()
    backgroundSize = 'cover';

    isLoading = true;

    readonly loadedImg$ = this.imageLoad.asObservable();

    protected getBgSize(isWidthLarger: boolean): 'cover' | 'contain' {
        return isWidthLarger ? 'contain' : 'cover';
    }
}
