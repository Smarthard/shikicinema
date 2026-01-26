import { Observable, map } from 'rxjs';
import {
    Pipe,
    PipeTransform,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { ResourceIdType } from '@app/shared/types';
import { getAnimeRateName } from '@app/modules/home/utils';
import { selectRates } from '@app/modules/home/store/anime-rates';

@Pipe({
    name: 'getAnimeName',
    standalone: true,
    pure: true,
})
export class GetAnimeNamePipe implements PipeTransform {
    readonly store = inject(Store);
    readonly rates$ = this.store.select(selectRates);

    transform(animeId: ResourceIdType, language: string): Observable<string> {
        return this.rates$.pipe(
            map((rates) => rates?.find(({ anime }) => anime?.id === animeId)),
            map((rate) => getAnimeRateName(rate, language)),
        );
    }
}
