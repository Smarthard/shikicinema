import { Pipe, PipeTransform } from '@angular/core';

import { UserAnimeRate } from '@app/shared/types/shikimori';
import { sortRatesByDateVisited } from '@app/modules/home/utils';

@Pipe({
    name: 'sortRatesByDateVisited',
    standalone: true,
    pure: true,
})
export class SortRatesByDateVisitedPipe implements PipeTransform {
    transform(userRates: UserAnimeRate[]): UserAnimeRate[] {
        return sortRatesByDateVisited(userRates);
    }
}
