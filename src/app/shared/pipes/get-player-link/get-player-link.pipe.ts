import { Pipe, PipeTransform } from '@angular/core';

import { ResourceIdType } from '@app/shared/types';

@Pipe({
    name: 'getPlayerLink',
    pure: true,
    standalone: true,
})
export class GetPlayerLinkPipe implements PipeTransform {
    transform(animeId: ResourceIdType): string {
        return `/player/${animeId}`;
    }
}
