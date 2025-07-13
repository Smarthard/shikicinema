import { Pipe, PipeTransform } from '@angular/core';

import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates';
import { UserBriefRateInterface } from '@app/shared/types/shikimori';
import { sortRatesByAnimeRating } from '@app/modules/home/utils';

@Pipe({
    name: 'sortRatesByAnimeRating',
    standalone: true,
    pure: true,
})
export class SortRatesByAnimeRatingPipe implements PipeTransform {
    transform(
        rates: UserBriefRateInterface[],
        ratesMetadata: AnimeRatesMetadata,
        language: string,
        isCaseSensitive = false,
        isAsc = true,
    ): UserBriefRateInterface[] {
        return rates?.sort((a, b) => sortRatesByAnimeRating(
            ratesMetadata?.[a.target_id],
            ratesMetadata?.[b.target_id],
            language,
            isCaseSensitive,
            isAsc,
        ));
    }
}
