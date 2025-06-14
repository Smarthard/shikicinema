import { Pipe, PipeTransform } from '@angular/core';

import { ResourceIdType } from '@app/shared/types/resource-id.type';


@Pipe({
    name: 'shikimoriAnimeLink',
    standalone: true,
})
export class ShikimoriAnimeLinkPipe implements PipeTransform {
    transform(animeId: ResourceIdType): string {
        return `/animes/${animeId}`;
    }
}
