import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { CardGridItemComponent } from '@app/modules/home/components/card-grid-item/card-grid-item.component';
import { GetPlayerLinkPipe } from '@app/shared/pipes/get-player-link/get-player-link.pipe';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { getAnimeName } from '@app/shared/utils/get-anime-name.function';
import { provideShikimoriImageLoader } from '@app/shared/providers/shikimori-image-loader.provider';

@Component({
    selector: 'app-card-grid',
    templateUrl: './card-grid.component.html',
    styleUrls: ['./card-grid.component.scss'],
    imports: [
        NgTemplateOutlet,
        AsyncPipe,
        SkeletonBlockComponent,
        CardGridItemComponent,
        GetPlayerLinkPipe,
    ],
    providers: [
        provideShikimoriImageLoader(96),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CardGridComponent {
    private readonly _transloco = inject(TranslocoService);

    readonly getAnimeName = getAnimeName;
    readonly currentLang$ = this._transloco.langChanges$;

    @HostBinding('class.anime-grid')
    animeGridClass = true;

    @Input()
    userAnimeRates: UserAnimeRate[];

    @Input()
    isLoading: boolean;

    userAnimeRatesFake = new Array<number>(30).fill(0);
}
