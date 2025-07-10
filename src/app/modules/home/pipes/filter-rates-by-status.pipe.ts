import { ExtendedUserRateStatusType } from '@app/modules/home/types';
import { Pipe, PipeTransform } from '@angular/core';
import { UserBriefRateInterface } from '@app/shared/types/shikimori';

@Pipe({
    name: 'filterRatesByStatus',
    standalone: true,
    pure: true,
})
export class FilterRatesByStatusPipe implements PipeTransform {
    transform(rates: UserBriefRateInterface[], status: ExtendedUserRateStatusType): UserBriefRateInterface[] {
        return rates?.filter((rate) => rate?.status === status);
    }
}
