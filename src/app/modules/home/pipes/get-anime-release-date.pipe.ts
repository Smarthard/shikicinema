import { Observable, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types';
import { selectRates } from '@app/modules/home/store/anime-rates';

@Pipe({
    name: 'getAnimeReleaseDate',
    standalone: true,
    pure: true,
})
export class GetAnimeReleaseDatePipe implements PipeTransform {
    readonly store = inject(Store);
    readonly rates$ = this.store.select(selectRates);

    transform(animeId: ResourceIdType): Observable<string> {
        return this.rates$.pipe(map((rates) => {
            const rate = rates?.find(({ anime }) => anime?.id === animeId);
            const date = rate?.anime?.released_on || rate?.anime?.aired_on;

            return date ? new Date(date)?.toISOString() : null;
        }));
    }
}
