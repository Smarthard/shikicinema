import { Pipe, PipeTransform } from '@angular/core';

import { UserBriefRateInterface } from '@app/shared/types/shikimori';
import { sortRatesByDateVisited } from '@app/modules/home/utils';

@Pipe({
    name: 'sortRatesByDateVisited',
    standalone: true,
    pure: true,
})
export class SortRatesByDateVisitedPipe implements PipeTransform {
    transform(userRates: UserBriefRateInterface[]): UserBriefRateInterface[] {
        return sortRatesByDateVisited(userRates);
    }
}
