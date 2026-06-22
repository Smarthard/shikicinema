import { Observable, combineLatest, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types';
import { UserAnimeRate } from '@app/shared/types/shikimori';
import { getAnimeRateName } from '@app/modules/home/utils';
import { selectRates } from '@app/modules/home/store/anime-rates';
import { selectRecentAnimes } from '@app/modules/home/store/recent-animes';

@Pipe({
    name: 'getAnimeName',
    standalone: true,
    pure: true,
})
export class GetAnimeNamePipe implements PipeTransform {
    private readonly store = inject(Store);
    private readonly recent$ = this.store.select(selectRecentAnimes);
    private readonly rates$ = this.store.select(selectRates);

    private readonly ratesMap$ = combineLatest([
        this.recent$,
        this.rates$,
    ]).pipe(
        map(([recent, rates]) => new Map(
            [...recent, ...rates].map((rate) => [rate.anime.id, rate])),
        ),
    );

    transform(animeId: ResourceIdType, language: string): Observable<string> {
        return this.ratesMap$.pipe(
            map((ratesMap) => ratesMap.get(animeId) as UserAnimeRate),
            map((rate) => getAnimeRateName(rate, language)),
        );
    }
}
