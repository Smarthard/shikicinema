import { Pipe, PipeTransform } from '@angular/core';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { AnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { getAnimeName } from '@app/shared/utils/get-anime-name.function';

@Pipe({
    name: 'getAnimeName',
    standalone: true,
    pure: true,
})
export class GetAnimeNamePipe implements PipeTransform {
    transform(animeRate: AnimeBriefInfoInterface | AnimeRate, language: string): string {
        return getAnimeName(animeRate, language);
    }
}
