import { Pipe, PipeTransform } from '@angular/core';

import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

@Pipe({
    name: 'sortRatesByDateVisited',
    standalone: true,
})
export class SortRatesByDateVisitedPipe implements PipeTransform {
    transform(userRates: UserAnimeRate[] = []): UserAnimeRate[] {
        return userRates.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
    }
}
