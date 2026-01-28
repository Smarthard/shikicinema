import { Observable, combineLatest, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types';
import { getAnimeRateName } from '@app/modules/home/utils';
import { selectRates } from '@app/modules/home/store/anime-rates';
import { selectRecentAnimes } from '@app/modules/home/store/recent-animes';

@Pipe({
    name: 'getAnimeName',
    standalone: true,
    pure: true,
})
export class GetAnimeNamePipe implements PipeTransform {
    readonly store = inject(Store);
    readonly recent$ = this.store.select(selectRecentAnimes);
    readonly rates$ = this.store.select(selectRates);

    readonly allRates$ = combineLatest([this.recent$, this.rates$])
        .pipe(map(([recent, rates]) => [...recent, ...rates]));

    transform(animeId: ResourceIdType, language: string): Observable<string> {
        return this.allRates$.pipe(
            map((rates) => rates?.find(({ anime }) => anime?.id === animeId)),
            map((rate) => getAnimeRateName(rate, language)),
        );
    }
}
