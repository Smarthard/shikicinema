import { createReducer, on } from '@ngrx/store';

import { defaultAvailableLangs } from '@app/transloco-root.module';
import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';
import {
    resetSettingsAction,
    updateSettingsAction,
} from '@app/store/settings/actions/settings.actions';

const initialState: SettingsStoreInterface = {
    language: '',
    availableLangs: defaultAvailableLangs,
};

const reducer = createReducer(
    initialState,
    on(
        updateSettingsAction,
        (state, { config }) => ({
            ...state,
            ...config,
        }),
    ),
    on(
        resetSettingsAction,
        () => ({ ...initialState }),
    )
);

export function settingsReducer(state, action) {
    return reducer(state, action);
}
