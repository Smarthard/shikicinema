import {
    PreloadAllModules,
    Routes,
    provideRouter,
    withComponentInputBinding,
    withHashLocation,
    withPreloading,
} from '@angular/router';

import { GoExternalPage } from '@app/core/pages/go-external/go-external.page';

const routes: Routes = [
    {
        path: 'external',
        component: GoExternalPage,
    },
    {
        path: 'home',
        loadChildren: () => import('./modules/home/home.routes').then((r) => r.HOME_ROUTES),
    },
    {
        path: 'player',
        loadChildren: () => import('./modules/player/player.routes').then((p) => p.PLAYER_ROUTES),
    },
    {
        path: 'contributions',
        loadChildren: () => import('./modules/contributions/contributions.routes').then((p) => p.CONTRIBUTIONS_ROUTES),
    },
    {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.routes').then((p) => p.SETTINGS_ROUTES),
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

export function provideAppRouting() {
    return provideRouter(
        routes,
        withHashLocation(),
        withComponentInputBinding(),
        withPreloading(PreloadAllModules),
    );
}
