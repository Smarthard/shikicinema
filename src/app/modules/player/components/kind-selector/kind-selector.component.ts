import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';

import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';

@Component({
    selector: 'app-kind-selector',
    standalone: true,
    imports: [
        IonSegment,
        IonSegmentButton,
        IonLabel,
        TranslocoPipe,
    ],
    templateUrl: './kind-selector.component.html',
    styleUrl: './kind-selector.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KindSelectorComponent {
    @HostBinding('class.kind-selector')
    kindSelectorClass = true;

    readonly ALL_KINDS: VideoKindEnum[] = [
        VideoKindEnum.DUBBING,
        VideoKindEnum.SUBTITLES,
        VideoKindEnum.ORIGINAL,
    ];

    @Input()
    kinds: VideoKindEnum[] = [];

    @Input()
    selected: VideoKindEnum;

    @Output()
    selection = new EventEmitter<VideoKindEnum>();
}
