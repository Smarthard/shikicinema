import { Observable, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types';
import { selectRatesMetadata } from '@app/modules/home/store/anime-rates';

@Pipe({
    name: 'getAnimeReleaseDate',
    standalone: true,
    pure: true,
})
export class GetAnimeReleaseDatePipe implements PipeTransform {
    readonly store = inject(Store);
    readonly ratesMetadata$ = this.store.select(selectRatesMetadata);

    transform(animeId: ResourceIdType): Observable<string> {
        return this.ratesMetadata$.pipe(map((metadata) => {
            const { releasedOn, airedOn } = metadata?.[animeId] || {};
            const date = releasedOn?.date || airedOn?.date;

            return date ? new Date(date)?.toISOString() : null;
        }));
    }
}
