import { createAction, props } from '@ngrx/store';

import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';


export const updateSettingsAction = createAction(
    '[Settings] Update',
    props<{ config: Partial<SettingsStoreInterface> }>(),
);

export const updatePlayerPreferencesAction = createAction(
    '[Settings] Update user preferences',
    props<{ animeId: number, author: string, kind: VideoKindEnum, domain: string }>(),
);

export const resetSettingsAction = createAction(
    '[Settings] Reset',
);

export const updateThemeAction = createAction(
    '[Settings] Update theme',
    props<{ theme: SettingsStoreInterface['theme'] }>(),
);

export const updateLanguageAction = createAction(
    '[Settings] Update language',
    props<{ language: string }>(),
);

export const visitPageAction = createAction(
    '[Settings] Visited page',
    props<{ url: string }>(),
);

export const togglePlayerModeAction = createAction(
    '[Settings] Toggle player mode',
);
