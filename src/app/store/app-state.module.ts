import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { RootStoreConfig, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';

import { environment } from '@app-env/environment';
import { AppStoreInterface } from '@app/store/app-store.interface';
import { settingsReducer } from '@app/store/settings/reducers/settings.reducer';
import { SettingsEffects } from '@app/store/settings/effects/settings.effects';
import { settingsLocalStorageSyncReducer } from '@app/store/settings/reducers/settings.meta-reducer';

const storeConfig: RootStoreConfig<AppStoreInterface> = {
    metaReducers: [
        settingsLocalStorageSyncReducer,
    ],
};

const storeDevtoolsConfig: StoreDevtoolsOptions = {
    name: 'Shikicinema State Devtools',
    maxAge: 100,
    logOnly: environment.isProduction,
};

@NgModule({
    imports: [
        StoreModule.forRoot<AppStoreInterface>({
            settings: settingsReducer,
        }, storeConfig),
        EffectsModule.forRoot([
            SettingsEffects,
        ]),
        StoreDevtoolsModule.instrument(storeDevtoolsConfig),
    ],
    providers: [],
})
export class AppStateModule {}
