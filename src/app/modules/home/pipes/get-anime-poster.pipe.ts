import { Pipe, PipeTransform } from '@angular/core';

import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates';
import { ResourceIdType } from '@app/shared/types';

@Pipe({
    name: 'getAnimePoster',
    standalone: true,
    pure: true,
})
export class GetAnimePosterPipe implements PipeTransform {
    transform(animeId: ResourceIdType, ratesMetadata: AnimeRatesMetadata, isHiResPref = true): string {
        const lowQualityPoster = `/system/animes/original/${animeId}.jpg`;
        const { originalUrl, preview2xUrl } = ratesMetadata?.[animeId]?.poster || {};
        const posterUrl = isHiResPref ? originalUrl : preview2xUrl;

        return posterUrl || lowQualityPoster;
    }
}
