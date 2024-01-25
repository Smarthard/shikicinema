import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerPage } from '@app/modules/player/player.page';

const routes: Routes = [
    {
        path: ':animeId/:episode',
        component: PlayerPage,
    },
    {
        path: ':animeId',
        redirectTo: ':animeId/1',
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
export class PlayerRoutingModule { }
