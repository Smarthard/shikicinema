import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Inject,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { CardGridItemComponent } from '@app/modules/home/components/card-grid-item/card-grid-item.component';
import { GetPlayerLinkPipe } from '@app/shared/pipes/get-player-link/get-player-link.pipe';
import { SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { getAnimeName } from '@app/shared/utils/get-anime-name.function';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

@Component({
    selector: 'app-card-grid',
    templateUrl: './card-grid.component.html',
    styleUrls: ['./card-grid.component.scss'],
    imports: [
        NgIf,
        NgFor,
        NgTemplateOutlet,
        AsyncPipe,
        SkeletonBlockComponent,
        CardGridItemComponent,
        GetPlayerLinkPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CardGridComponent {
    readonly trackById = trackById;
    readonly getAnimeName = getAnimeName;
    readonly currentLang$ = this._transloco.langChanges$;

    @HostBinding('class.anime-grid')
    animeGridClass = true;

    @Input()
    userAnimeRates: UserAnimeRate[];

    @Input()
    isLoading: boolean;

    userAnimeRatesFake = new Array<number>(30).fill(0);

    constructor(
        @Inject(SHIKIMORI_DOMAIN_TOKEN)
        readonly shikimoriDomain$: Observable<string>,
        private readonly _transloco: TranslocoService,
    ) {}
}
