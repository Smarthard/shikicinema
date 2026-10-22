import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
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
} from '@ionic/angular';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { TranslocoService } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { GetColorForSelectablePipe } from '@app/shared/pipes/get-color-for-selectable/get-color-for-selectable.pipe';
import { GetUrlDomainPipe } from '@app/shared/pipes/get-url-domain/get-url-domain.pipe';
import { HasQualitiesPipe } from '@app/modules/player/pipes/has-qualities.pipe';
import { PlayerKindDisplayMode } from '@app/store/settings/types';
import { SortByDomainPipe } from '@app/shared/pipes/sort-by-domain/sort-by-domain.pipe';
import { VideoInfoInterface, VideoKindEnum, VideoQualityEnum } from '@app/modules/player/types';
import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';

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
    videos = input.required<VideoInfoInterface[]>();
    kindDisplayMode = input.required<PlayerKindDisplayMode>();
    kind = input.required<VideoKindEnum>();

    selected = input<VideoInfoInterface>();
    isAvailableForAllEpisodes = input<boolean>();
    defaultAuthorName = input<string>();

    toggleOpen = output<string>();
    selectVideo = output<VideoInfoInterface>();

    onOpenVideoInOtherTab(video: VideoInfoInterface): void {
        // TODO: заменить логику для native-app
        window.open(video.url);
    }

    isSameAuthor = computed(() => {
        const defaultAuthor = this.defaultAuthorName();
        const normalizedSelectedAuthor = cleanAuthorName(this.selected()?.author, defaultAuthor);
        const normalizedAuthor = cleanAuthorName(this.author(), defaultAuthor);

        const isMatchKind = this.selected()?.kind === this.kind();
        const isMatchAuthor = normalizedSelectedAuthor === normalizedAuthor;

        return isMatchKind && isMatchAuthor;
    })

    isSameUrl(url: string): boolean {
        return this.selected()?.url === url;
    }
}
