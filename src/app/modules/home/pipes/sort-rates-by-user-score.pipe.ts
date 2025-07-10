import { Observable, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { UserBriefRateInterface } from '@app/shared/types/shikimori';
import { selectRatesMetadata } from '@app/modules/home/store/anime-rates';
import { sortRatesByUserScore } from '@app/modules/home/utils';

@Pipe({
    name: 'sortRatesByUserScore',
    standalone: true,
    pure: true,
})
export class SortRatesByUserScorePipe implements PipeTransform {
    readonly store = inject(Store);
    readonly ratesMetadata$ = this.store.select(selectRatesMetadata);

    transform(
        rates: UserBriefRateInterface[],
        language: string,
        isCaseSensitive = false,
        isAsc = true,
    ): Observable<UserBriefRateInterface[]> {
        return this.ratesMetadata$.pipe(map((metadata) => rates?.sort((a, b) => sortRatesByUserScore(
            a,
            b,
            metadata,
            language,
            isCaseSensitive,
            isAsc,
        ))));
    }
}
