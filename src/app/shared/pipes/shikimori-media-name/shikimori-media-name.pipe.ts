import { Pipe, PipeTransform } from '@angular/core';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { ShikimoriMediaNameType } from '@app/shared/types/shikimori/shikimori-media-name.type';

@Pipe({
    name: 'shikimoriMediaName',
    pure: true,
})
export class ShikimoriMediaNamePipe implements PipeTransform {
    transform(
        media: AnimeBriefInfoInterface,
        nameToShow: ShikimoriMediaNameType,
    ): string {
        return nameToShow === 'original' ? media.name : media.russian;
    }
}
