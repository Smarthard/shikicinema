import { Pipe, PipeTransform } from '@angular/core';

import { UserAnimeRate } from '@app/shared/types/shikimori';
import { sortRatesByAnimeName } from '@app/modules/home/utils';

@Pipe({
    name: 'sortRatesByAnimeName',
    standalone: true,
    pure: true,
})
export class SortRatesByAnimeNamePipe implements PipeTransform {
    transform(
        rates: UserAnimeRate[],
        language: string,
        isCaseSensitive = false,
    ): UserAnimeRate[] {
        return rates?.sort((a, b) => sortRatesByAnimeName(
            a,
            b,
            language,
            isCaseSensitive,
        ));
    }
}
