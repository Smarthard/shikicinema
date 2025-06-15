import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    ViewEncapsulation,
    inject,
    input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { CardGridItemComponent } from '@app/modules/home/components/card-grid-item/card-grid-item.component';
import { GetAnimeNamePipe } from '@app/shared/pipes/get-anime-name/get-anime-name.pipe';
import { GetPlayerLinkPipe } from '@app/shared/pipes/get-player-link/get-player-link.pipe';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { provideShikimoriImageLoader } from '@app/shared/providers/shikimori-image-loader.provider';

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
    ],
    providers: [
        provideShikimoriImageLoader(96),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CardGridComponent {
    @HostBinding('class.anime-grid')
    private animeGridClass = true;

    private readonly _transloco = inject(TranslocoService);

    readonly currentLang = toSignal(this._transloco.langChanges$);
    readonly userAnimeRatesSkeleton = new Array<number>(30).fill(0);

    userAnimeRates = input<UserAnimeRate[]>();

    isLoading = input<boolean>();
}
