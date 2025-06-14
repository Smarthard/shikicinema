import {
    AsyncPipe,
    IMAGE_CONFIG,
    IMAGE_LOADER,
    NgTemplateOutlet,
} from '@angular/common';
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
import { DEFAULT_SHIKIMORI_DOMAIN_TOKEN, SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { GetPlayerLinkPipe } from '@app/shared/pipes/get-player-link/get-player-link.pipe';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { getAnimeName } from '@app/shared/utils/get-anime-name.function';
import { shikimoriImageLoader } from '@app/shared/utils/shikimori-image-loader.function';

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
        {
            provide: IMAGE_CONFIG,
            useValue: {
                placeholderResolution: 96,
            },
        },
        {
            provide: IMAGE_LOADER,
            useFactory: shikimoriImageLoader,
            deps: [SHIKIMORI_DOMAIN_TOKEN, DEFAULT_SHIKIMORI_DOMAIN_TOKEN],
        },
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
