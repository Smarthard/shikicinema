import { createAction, props } from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';

export const findAnimeAction = createAction(
    '[Shikimori API] find anime',
    props<{ searchStr: string }>(),
);

export const findAnimeSuccessAction = createAction(
    '[Shikimori API] find anime success',
    props<{ animes: AnimeBriefInfoInterface[] }>(),
);

export const findAnimeFailureAction = createAction(
    '[Shikimori API] find anime failure',
    props<{ errors: any }>(),
);

export const resetFoundAnimeAction = createAction(
    '[Shikimori API] reset found anime',
);
