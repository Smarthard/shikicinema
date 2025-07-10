import { Pipe, PipeTransform } from '@angular/core';

import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates';
import { UserBriefRateInterface } from '@app/shared/types/shikimori';
import { sortRatesByUserScore } from '@app/modules/home/utils';

@Pipe({
    name: 'sortRatesByUserScore',
    standalone: true,
    pure: true,
})
export class SortRatesByUserScorePipe implements PipeTransform {
    transform(
        rates: UserBriefRateInterface[],
        ratesMetadata: AnimeRatesMetadata,
        language: string,
        isCaseSensitive = false,
        isAsc = true,
    ): UserBriefRateInterface[] {
        return rates?.sort((a, b) => sortRatesByUserScore(
            a,
            b,
            ratesMetadata,
            language,
            isCaseSensitive,
            isAsc,
        ));
    }
}
