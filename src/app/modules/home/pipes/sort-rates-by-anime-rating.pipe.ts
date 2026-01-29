import { Pipe, PipeTransform } from '@angular/core';

import { UserAnimeRate } from '@app/shared/types/shikimori';
import { sortRatesByAnimeRating } from '@app/modules/home/utils';

@Pipe({
    name: 'sortRatesByAnimeRating',
    standalone: true,
    pure: true,
})
export class SortRatesByAnimeRatingPipe implements PipeTransform {
    transform(
        rates: UserAnimeRate[],
        language: string,
        isCaseSensitive = false,
        isAsc = true,
    ): UserAnimeRate[] {
        return rates?.sort((a, b) => sortRatesByAnimeRating(
            a,
            b,
            language,
            isCaseSensitive,
            isAsc,
        ));
    }
}
