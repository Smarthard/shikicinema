import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { GoExternalPage } from '@app/core/pages/go-external/go-external.page';

const routes: Routes = [
    {
        path: 'external',
        component: GoExternalPage,
    },
    {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then(({ HomePageModule }) => HomePageModule),
    },
    {
        path: 'player',
        loadChildren: () => import('./modules/player/player.module').then(({ PlayerModule }) => PlayerModule),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
