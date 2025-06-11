import { AsyncPipe, NgStyle } from '@angular/common';
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

    override height = input('100%');

    override width = input('auto');

    override backgroundSize = input('cover');

    override isLoading = true;

    readonly loadedImg$ = outputToObservable(this.imageLoad);

    protected getBgSize(isWidthLarger: boolean): 'cover' | 'contain' {
        return isWidthLarger ? 'contain' : 'cover';
    }
}
