import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    ViewEncapsulation,
    input,
} from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { AbstractImageCardComponent } from '@app/shared/components/abstract-image-card/abstract-image-card.component';
import { IsImageWidthLargerPipe } from '@app/shared/pipes/is-image-width-larger/is-image-width-larger.pipe';
import { RectangleFitPipe } from '@app/modules/home/pipes/rectangle-fit.pipe';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: ['./image-card.component.scss'],
    standalone: true,
    imports: [
        AsyncPipe,
        RectangleFitPipe,
        IsImageWidthLargerPipe,
        SkeletonBlockComponent,
        NgOptimizedImage,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ImageCardComponent extends AbstractImageCardComponent {
    @HostBinding('class.image-card')
    imageCardClass = true;

    override height = input('100%');

    override width = input('auto');

    override backgroundSize = input('cover');

    hasPriority = input(false);

    readonly loadedImg$ = outputToObservable(this.imageLoad);
}
