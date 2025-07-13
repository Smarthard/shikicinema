import { Pipe, PipeTransform } from '@angular/core';

import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates';
import { ResourceIdType } from '@app/shared/types';

@Pipe({
    name: 'getAnimeReleaseDate',
    standalone: true,
    pure: true,
})
export class GetAnimeReleaseDatePipe implements PipeTransform {
    transform(animeId: ResourceIdType, ratesMetadata: AnimeRatesMetadata): string {
        const { releasedOn, airedOn } = ratesMetadata?.[animeId] || {};
        const date = releasedOn?.date || airedOn?.date;

        return date ? new Date(date)?.toISOString() : null;
    }
}
