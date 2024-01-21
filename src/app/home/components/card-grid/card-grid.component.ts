import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';

import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

@Component({
    selector: 'app-card-grid',
    templateUrl: './card-grid.component.html',
    styleUrls: ['./card-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CardGridComponent {
    readonly trackById = trackById;

    @HostBinding('class.anime-grid')
    animeGridClass = true;

    @Input()
    userAnimeRates: UserAnimeRate[];

    @Input()
    isLoading: boolean;

    userAnimeRatesFake = new Array<number>(30).fill(0);
}
