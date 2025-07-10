import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    inject,
    input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RepeatPipe } from 'ngxtension/repeat-pipe';
import { TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates';
import { CardGridItemComponent } from '@app/modules/home/components/card-grid-item/card-grid-item.component';
import {
    GetAnimeKindPipe,
    GetAnimeNamePipe,
    GetAnimePosterPipe,
    GetAnimeReleaseDatePipe,
} from '@app/modules/home/pipes';
import { GetPlayerLinkPipe } from '@app/shared/pipes/get-player-link/get-player-link.pipe';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { UserBriefRateInterface } from '@app/shared/types/shikimori';
import { provideShikimoriImageLoader } from '@app/shared/providers/shikimori-image-loader.provider';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

@Component({
    selector: 'app-card-grid',
    templateUrl: './card-grid.component.html',
    styleUrls: ['./card-grid.component.scss'],
    imports: [
        NgTemplateOutlet,
        SkeletonBlockComponent,
        CardGridItemComponent,
        GetPlayerLinkPipe,
        GetAnimeNamePipe,
        RepeatPipe,
        GetAnimePosterPipe,
        GetAnimeKindPipe,
        GetAnimeReleaseDatePipe,
    ],
    providers: [
        provideShikimoriImageLoader(96),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'anime-grid' },
})
export class CardGridComponent {
    private readonly _transloco = inject(TranslocoService);

    readonly trackById = trackById;
    readonly currentLang = toSignal(this._transloco.langChanges$);

    userAnimeRates = input.required<UserBriefRateInterface[]>();
    ratesMetadata = input.required<AnimeRatesMetadata>();

    isRatesLoading = input(true);
    isMetaLoading = input(true);
}
