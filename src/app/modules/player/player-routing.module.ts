import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerPage } from '@app/modules/player/player.page';
import { skipWatchedEpisodesGuard } from '@app/modules/player/guards/skip-watched-episodes';

const routes: Routes = [
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

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PlayerRoutingModule {}
