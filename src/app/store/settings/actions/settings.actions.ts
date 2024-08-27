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
