import { Routes } from '@angular/router';

import { PlayerPage } from '@app/modules/player/player.page';
import { skipWatchedEpisodesGuard } from '@app/modules/player/guards/skip-watched-episodes';

export const PLAYER_ROUTES: Routes = [
    {
        path: ':animeId/:episode',
        component: PlayerPage,
    },
    {
        path: ':animeId',
        canActivate: [skipWatchedEpisodesGuard],
        component: PlayerPage,
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
    },
];
