import { Observable, combineLatest, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types';
import { selectRates } from '@app/modules/home/store/anime-rates';
import { selectRecentAnimes } from '@app/modules/home/store/recent-animes';

@Pipe({
    name: 'getAnimeReleaseDate',
    standalone: true,
    pure: true,
})
export class GetAnimeReleaseDatePipe implements PipeTransform {
    readonly store = inject(Store);
    readonly recent$ = this.store.select(selectRecentAnimes);
    readonly rates$ = this.store.select(selectRates);

    readonly allRates$ = combineLatest([this.recent$, this.rates$])
        .pipe(map(([recent, rates]) => [...recent, ...rates]));

    transform(animeId: ResourceIdType): Observable<string> {
        return this.allRates$.pipe(map((rates) => {
            const rate = rates?.find(({ anime }) => anime?.id === animeId);
            const date = rate?.anime?.released_on || rate?.anime?.aired_on;

            return date ? new Date(date)?.toISOString() : null;
        }));
    }
}
