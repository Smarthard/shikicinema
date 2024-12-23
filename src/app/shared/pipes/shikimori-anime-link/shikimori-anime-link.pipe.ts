import { Pipe, PipeTransform } from '@angular/core';

import { ResourceIdType } from '@app/shared/types/resource-id.type';


@Pipe({
    name: 'shikimoriAnimeLink',
    standalone: true,
})
export class ShikimoriAnimeLinkPipe implements PipeTransform {
    transform(shikimoriDomain: string, animeId: ResourceIdType): string {
        return `${shikimoriDomain}/animes/${animeId}`;
    }
}
