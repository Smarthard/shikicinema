import { Pipe, PipeTransform } from '@angular/core';

import { AnimeKindType } from '@app/shared/types/shikimori';
import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates';
import { ResourceIdType } from '@app/shared/types';

@Pipe({
    name: 'getAnimeKind',
    standalone: true,
    pure: true,
})
export class GetAnimeKindPipe implements PipeTransform {
    transform(animeId: ResourceIdType, ratesMetadata: AnimeRatesMetadata): AnimeKindType {
        return ratesMetadata?.[animeId]?.kind;
    }
}
