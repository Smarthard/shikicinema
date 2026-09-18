import { Pipe, PipeTransform } from '@angular/core';

import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { getShikimoriAnimeLink } from '@app/shared/utils/get-shikimori-anime-link.function';


@Pipe({
    name: 'shikimoriAnimeLink',
    standalone: true,
})
export class ShikimoriAnimeLinkPipe implements PipeTransform {
    transform(animeId: ResourceIdType): string {
        return getShikimoriAnimeLink(animeId);
    }
}
