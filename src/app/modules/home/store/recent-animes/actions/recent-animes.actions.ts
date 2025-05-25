import { createAction, props } from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';

export const visitAnimePageAction = createAction(
    '[Recent Animes] Visit anime page',
    props<{ anime: AnimeBriefInfoInterface, episode: number }>(),
);
