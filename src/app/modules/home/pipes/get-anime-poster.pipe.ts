import { Pipe, PipeTransform } from '@angular/core';

import { ResourceIdType } from '@app/shared/types';
import { environment } from '@app-env/environment';

@Pipe({
    name: 'getAnimePoster',
    standalone: true,
    pure: true,
})
export class GetAnimePosterPipe implements PipeTransform {
    static readonly HOST = `${environment.smarthard.apiURI}/static/animes`;

    transform(animeId: ResourceIdType, isHiResPref = true, isSupportsAvif = true): string {
        const hiResUrl = isSupportsAvif
            ? `${GetAnimePosterPipe.HOST}/${animeId}.avif`
            : `${GetAnimePosterPipe.HOST}/${animeId}.jpeg`;
        const lowResUrl = `${GetAnimePosterPipe.HOST}/${animeId}.webp`;

        return isHiResPref ? hiResUrl : lowResUrl;
    }
}
