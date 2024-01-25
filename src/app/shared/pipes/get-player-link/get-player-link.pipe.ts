import { Pipe, PipeTransform } from '@angular/core';

import { AnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

@Pipe({
    name: 'getPlayerLink',
    pure: true,
    standalone: true,
})
export class GetPlayerLinkPipe implements PipeTransform {
    transform(anime: AnimeRate): string {
        const { id: animeId, episodes: episode } = anime;

        return `/player/${animeId}/${episode}`;
    }
}
