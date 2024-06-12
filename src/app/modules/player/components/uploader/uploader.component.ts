import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';

import { SkeletonBlockModule } from '@app-root/app/shared/components/skeleton-block/skeleton-block.module';
import { UploaderInterface } from '@app/modules/player/types';

@Component({
    selector: 'app-uploader',
    standalone: true,
    imports: [
        SkeletonBlockModule,
    ],
    templateUrl: './uploader.component.html',
    styleUrl: './uploader.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderComponent {
    @HostBinding('class.uploader')
    private uploaderClass = true;

    @Input()
    uploader: UploaderInterface;
}
