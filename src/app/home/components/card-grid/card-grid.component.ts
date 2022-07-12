import { Component, Input } from '@angular/core';

import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

@Component({
    selector: 'app-card-grid',
    templateUrl: './card-grid.component.html',
    styleUrls: ['./card-grid.component.scss'],
})
export class CardGridComponent {
    @Input()
    userAnimeRates: UserAnimeRate[];

    @Input()
    height: string;

    @Input()
    width: string;

    @Input()
    isLoading: boolean;

    userAnimeRatesFake = new Array<number>(30).fill(0);

    trackById = trackById;
}
