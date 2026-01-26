import { Observable, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { AnimeKindType } from '@app/shared/types/shikimori';
import { ResourceIdType } from '@app/shared/types';
import { selectRates } from '@app/modules/home/store/anime-rates';

@Pipe({
    name: 'getAnimeKind',
    standalone: true,
    pure: true,
})
export class GetAnimeKindPipe implements PipeTransform {
    readonly store = inject(Store);
    readonly rates$ = this.store.select(selectRates);

    transform(animeId: ResourceIdType): Observable<AnimeKindType> {
        return this.rates$.pipe(
            map((rates) => rates?.find(({ anime }) => anime?.id === animeId)),
            map((rate) => rate?.anime?.kind),
        );
    }
}
