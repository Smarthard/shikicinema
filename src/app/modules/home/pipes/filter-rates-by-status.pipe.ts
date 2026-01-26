import { Pipe, PipeTransform } from '@angular/core';

import { ExtendedUserRateStatusType } from '@app/modules/home/types';
import { UserAnimeRate } from '@app/shared/types/shikimori';

@Pipe({
    name: 'filterRatesByStatus',
    standalone: true,
    pure: true,
})
export class FilterRatesByStatusPipe implements PipeTransform {
    transform(rates: UserAnimeRate[], status: ExtendedUserRateStatusType): UserAnimeRate[] {
        return rates?.filter((rate) => rate?.status === status);
    }
}
