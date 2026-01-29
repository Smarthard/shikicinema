import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { UploaderInterface } from '@app/modules/player/types';
import { isWellKnownUploaderPipe } from '@app/modules/player/pipes/is-known-uploader.pipe';

@Component({
    selector: 'app-uploader',
    standalone: true,
    imports: [
        NgTemplateOutlet,
        SkeletonBlockComponent,
        isWellKnownUploaderPipe,
        TranslocoPipe,
    ],
    templateUrl: './uploader.component.html',
    styleUrl: './uploader.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderComponent {
    @HostBinding('class.uploader')
    protected uploaderClass = true;

    @Input()
    uploader: UploaderInterface;
}
