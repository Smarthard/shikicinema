import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';

import { AbstractImageCardComponent } from '@app/shared/components/abstract-image-card/abstract-image-card.component';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: ['./image-card.component.scss'],
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
