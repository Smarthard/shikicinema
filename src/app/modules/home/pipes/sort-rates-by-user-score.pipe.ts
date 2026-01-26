import {
    Pipe,
    PipeTransform,
} from '@angular/core';

import { UserAnimeRate } from '@app/shared/types/shikimori';
import { sortRatesByUserScore } from '@app/modules/home/utils';

@Pipe({
    name: 'sortRatesByUserScore',
    standalone: true,
    pure: true,
})
export class SortRatesByUserScorePipe implements PipeTransform {
    transform(
        rates: UserAnimeRate[],
        language: string,
        isCaseSensitive = false,
        isAsc = true,
    ): UserAnimeRate[] {
        return rates?.sort((a, b) => sortRatesByUserScore(
            a,
            b,
            language,
            isCaseSensitive,
            isAsc,
        ));
    }
}
