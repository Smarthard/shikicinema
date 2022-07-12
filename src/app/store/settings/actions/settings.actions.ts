import { createAction, props } from '@ngrx/store';

import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';


export const updateSettingsAction = createAction(
    '[Settings] Update',
    props<{ config: Partial<SettingsStoreInterface> }>(),
);

export const resetSettingsAction = createAction(
    '[Settings] Reset',
);
