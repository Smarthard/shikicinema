import { Pipe, PipeTransform } from '@angular/core';

import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates';
import { UserBriefRateInterface } from '@app/shared/types/shikimori';
import { sortRatesByAnimeName } from '@app/modules/home/utils';

@Pipe({
    name: 'sortRatesByAnimeName',
    standalone: true,
    pure: true,
})
export class SortRatesByAnimeNamePipe implements PipeTransform {
    transform(
        rates: UserBriefRateInterface[],
        ratesMetadata: AnimeRatesMetadata,
        language: string,
        isCaseSensitive = false,
    ): UserBriefRateInterface[] {
        return rates?.sort((a, b) => sortRatesByAnimeName(
            ratesMetadata?.[a.target_id],
            ratesMetadata?.[b.target_id],
            language,
            isCaseSensitive,
        ));
    }
}
