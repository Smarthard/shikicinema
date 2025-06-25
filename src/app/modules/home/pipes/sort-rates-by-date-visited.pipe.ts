import { Pipe, PipeTransform } from '@angular/core';

import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { sortRatesByDateVisited } from '@app/modules/home/utils';

@Pipe({
    name: 'sortRatesByDateVisited',
    standalone: true,
})
export class SortRatesByDateVisitedPipe implements PipeTransform {
    transform(userRates: UserAnimeRate[] = []): UserAnimeRate[] {
        return sortRatesByDateVisited(userRates);
    }
}
