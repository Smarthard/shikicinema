import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { RootStoreConfig, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';

import { environment } from '@app-env/environment';
import { AppStoreInterface } from '@app/store/app-store.interface';
import { settingsReducer } from '@app/store/settings/reducers/settings.reducer';
import { SettingsEffects } from '@app/store/settings/effects/settings.effects';
import { settingsLocalStorageSyncReducer } from '@app/store/settings/reducers/settings.meta-reducer';
import { shikimoriReducer } from '@app/store/shikimori/reducers/shikimori.reducer';
import { ShikimoriEffects } from '@app/store/shikimori/effects/shikimori.effects';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { loggerMetaReducer } from '@app/store/logger/reducers/logger.meta-reducer';

const storeConfig: RootStoreConfig<AppStoreInterface> = {
    metaReducers: [
        settingsLocalStorageSyncReducer,
        loggerMetaReducer,
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
            shikimori: shikimoriReducer,
        }, storeConfig),
        EffectsModule.forRoot([
            SettingsEffects,
            ShikimoriEffects,
        ]),
        StoreDevtoolsModule.instrument(storeDevtoolsConfig),
    ],
    providers: [
        ShikimoriClient,
    ],
})
export class AppStateModule {}
