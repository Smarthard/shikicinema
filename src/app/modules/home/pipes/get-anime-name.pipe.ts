import { Pipe, PipeTransform } from '@angular/core';

import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates';
import { ResourceIdType } from '@app/shared/types';
import { getAnimeRateName } from '@app/modules/home/utils';

@Pipe({
    name: 'getAnimeName',
    standalone: true,
    pure: true,
})
export class GetAnimeNamePipe implements PipeTransform {
    transform(animeId: ResourceIdType, language: string, ratesMetadata: AnimeRatesMetadata): string {
        return getAnimeRateName(ratesMetadata?.[animeId], language);
    }
}
