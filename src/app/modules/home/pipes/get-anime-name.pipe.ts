import { Observable, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types';
import { getAnimeRateName } from '@app/modules/home/utils';
import { selectRatesMetadata } from '@app/modules/home/store/anime-rates';

@Pipe({
    name: 'getAnimeName',
    standalone: true,
    pure: true,
})
export class GetAnimeNamePipe implements PipeTransform {
    readonly store = inject(Store);
    readonly ratesMetadata$ = this.store.select(selectRatesMetadata);

    transform(animeId: ResourceIdType, language: string): Observable<string> {
        return this.ratesMetadata$.pipe(map((metadata) => getAnimeRateName(metadata?.[animeId], language)));
    }
}
