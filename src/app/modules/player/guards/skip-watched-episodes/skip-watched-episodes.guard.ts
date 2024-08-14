import { CanActivateChildFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, map, switchMap } from 'rxjs';
import { inject } from '@angular/core';

import { getAnimeInfoAction } from '@app/modules/player/store/actions';
import { getLastUnwatchedEpisode } from '@app/modules/player/utils';
import { selectPlayerAnime } from '@app/modules/player/store/selectors/player.selectors';


export const skipWatchedEpisodesGuard: CanActivateChildFn = (route) => {
    const animeId = route.paramMap.get('animeId');
    const hasEpisode = !!route.paramMap.get('episode');

    if (hasEpisode) {
        return true;
    } else {
        const store = inject(Store);
        const router = inject(Router);

        store.dispatch(getAnimeInfoAction({ animeId }));

        return store.select(selectPlayerAnime(animeId)).pipe(
            first((anime) => !!anime?.id),
            map((anime) => getLastUnwatchedEpisode(anime)),
            switchMap((episode) => router.navigate(['/player', animeId, episode], { replaceUrl: true })),
        );
    }
};
