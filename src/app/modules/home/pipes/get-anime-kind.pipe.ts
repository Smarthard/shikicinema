import { Observable, combineLatest, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { AnimeKindType } from '@app/shared/types/shikimori';
import { ResourceIdType } from '@app/shared/types';
import { selectRates } from '@app/modules/home/store/anime-rates';
import { selectRecentAnimes } from '@app/modules/home/store/recent-animes';

@Pipe({
    name: 'getAnimeKind',
    standalone: true,
    pure: true,
})
export class GetAnimeKindPipe implements PipeTransform {
    readonly store = inject(Store);
    readonly recent$ = this.store.select(selectRecentAnimes);
    readonly rates$ = this.store.select(selectRates);

    readonly allRates$ = combineLatest([this.recent$, this.rates$])
        .pipe(map(([recent, rates]) => [...recent, ...rates]));

    transform(animeId: ResourceIdType): Observable<AnimeKindType> {
        return this.allRates$.pipe(
            map((rates) => rates?.find(({ anime }) => anime?.id === animeId)),
            map((rate) => rate?.anime?.kind),
        );
    }
}
