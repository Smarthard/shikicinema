import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    inject,
    input,
    output,
} from '@angular/core';
import {
    IonAccordion,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
} from '@ionic/angular/standalone';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { TranslocoService } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

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
        IonIcon,
        GetUrlDomainPipe,
        GetColorForSelectablePipe,
        IsSameAuthorPipe,
        IsSameVideoPipe,
        SortByDomainPipe,
        HasQualitiesPipe,
        UpperCasePipe,
        NgxTippyModule,
    ],
    templateUrl: './video-selector-item.component.html',
    styleUrl: './video-selector-item.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoSelectorItemComponent {
    private readonly transloco = inject(TranslocoService);

    readonly VideoQualityEnum = VideoQualityEnum;

    readonly availabilityIssueTip = toSignal(
        this.transloco.selectTranslate('PLAYER_MODULE.PLAYER_PAGE.PLAYER.AUTHOR_AVAILABILITY_ISSUE'),
    );

    author = input.required<string>();
    selected = input.required<VideoInfoInterface>();
    videos = input.required<VideoInfoInterface[]>();
    kindDisplayMode = input.required<PlayerKindDisplayMode>();
    isAvailableForAllEpisodes = input<boolean>();
    defaultAuthorName = input<string>();

    toggleOpen = output<string>();
    selectVideo = output<VideoInfoInterface>();
}
