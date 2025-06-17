import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    input,
    output,
} from '@angular/core';
import {
    IonAccordion,
    IonButton,
    IonItem,
    IonLabel,
} from '@ionic/angular/standalone';
import { UpperCasePipe } from '@angular/common';

import { GetColorForSelectablePipe } from '@app/shared/pipes/get-color-for-selectable/get-color-for-selectable.pipe';
import { GetUrlDomainPipe } from '@app/shared/pipes/get-url-domain/get-url-domain.pipe';
import { HasQualitiesPipe } from '@app/modules/player/pipes/has-qualities.pipe';
import { IsSameAuthorPipe } from '@app/shared/pipes/is-same-author/is-same-author.pipe';
import { IsSameVideoPipe } from '@app/shared/pipes/is-same-video/is-same-video.pipe';
import { PlayerKindDisplayMode } from '@app/store/settings/types';
import { SortByDomainPipe } from '@app/shared/pipes/sort-by-domain/sort-by-domain.pipe';
import { VideoInfoInterface, VideoQualityEnum } from '@app/modules/player/types';

@Component({
    selector: 'app-video-selector-item',
    imports: [
        IonAccordion,
        IonItem,
        IonLabel,
        IonButton,
        GetUrlDomainPipe,
        GetColorForSelectablePipe,
        IsSameAuthorPipe,
        IsSameVideoPipe,
        SortByDomainPipe,
        HasQualitiesPipe,
        UpperCasePipe,
    ],
    templateUrl: './video-selector-item.component.html',
    styleUrl: './video-selector-item.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoSelectorItemComponent {
    readonly VideoQualityEnum = VideoQualityEnum;

    author = input.required<string>();
    selected = input.required<VideoInfoInterface>();
    videos = input.required<VideoInfoInterface[]>();
    kindDisplayMode = input.required<PlayerKindDisplayMode>();
    defaultAuthorName = input<string>();

    toggleOpen = output<string>();
    selectVideo = output<VideoInfoInterface>();
}
