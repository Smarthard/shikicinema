import { createReducer, on } from '@ngrx/store';

import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';
import { defaultAvailableLangs } from '@app/core/transloco-root.module';
import {
    resetSettingsAction,
    updateSettingsAction,
} from '@app/store/settings/actions/settings.actions';

const initialState: SettingsStoreInterface = {
    language: '',
    availableLangs: defaultAvailableLangs,
    animePaginationSize: 100,
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
    ),
);

export function settingsReducer(state, action) {
    return reducer(state, action);
}
