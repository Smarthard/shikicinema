import { EnvironmentProviders, Provider } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { PlayerEffects } from '@app/modules/player/store/effects/player.effects';
import { PlayerPage } from '@app/modules/player/player.page';
import { WELL_KNOWN_UPLOADERS_MAP } from '@app/shared/config/well-known-uploaders.config';
import { WELL_KNOWN_UPLOADERS_TOKEN } from '@app/shared/types/well-known-uploaders.token';
import { playerReducer } from '@app/modules/player/store/reducers/player-state.reducer';
import { skipWatchedEpisodesGuard } from '@app/modules/player/guards/skip-watched-episodes';

const providers: (EnvironmentProviders | Provider)[] = [
    provideState({ name: 'player', reducer: playerReducer }),
    provideEffects(
        PlayerEffects,
    ),
    ModalController,
    { provide: WELL_KNOWN_UPLOADERS_TOKEN, useValue: WELL_KNOWN_UPLOADERS_MAP },
];

export const PLAYER_ROUTES: Routes = [
    {
        path: ':animeId/:episode',
        component: PlayerPage,
        providers,
    },
    {
        path: ':animeId',
        canActivate: [skipWatchedEpisodesGuard],
        component: PlayerPage,
        providers,
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
    },
];
