import { Observable, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { AnimeKindType } from '@app/shared/types/shikimori';
import { ResourceIdType } from '@app/shared/types';
import { selectRatesMetadata } from '@app/modules/home/store/anime-rates';

@Pipe({
    name: 'getAnimeKind',
    standalone: true,
    pure: true,
})
export class GetAnimeKindPipe implements PipeTransform {
    readonly store = inject(Store);
    readonly ratesMetadata$ = this.store.select(selectRatesMetadata);

    transform(animeId: ResourceIdType): Observable<AnimeKindType> {
        return this.ratesMetadata$.pipe(map((metadata) => metadata?.[animeId]?.kind));
    }
}
