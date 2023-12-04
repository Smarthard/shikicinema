import { Actions, EffectsModule, USER_PROVIDED_EFFECTS } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { RootStoreConfig, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';

import { AppStoreInterface } from '@app/store/app-store.interface';
import { AuthNativeAppEffects } from '@app/store/auth/effects/auth.native-app.effects';
import { AuthWebExtensionEffects } from '@app/store/auth/effects/auth.web-extension.effects';
import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';
import { SettingsEffects } from '@app/store/settings/effects/settings.effects';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { ShikimoriEffects } from '@app/store/shikimori/effects/shikimori.effects';
import { authEffectFactory } from '@app/store/auth/factories/auth-effects.factories';
import { authLocalStorageSyncReducer } from '@app/store/auth/reducers/auth.meta-reducer';
import { authReducer } from '@app/store/auth/reducers/auth.reducer';
import { environment } from '@app-env/environment';
import { loggerMetaReducer } from '@app/store/logger/reducers/logger.meta-reducer';
import { settingsLocalStorageSyncReducer } from '@app/store/settings/reducers/settings.meta-reducer';
import { settingsReducer } from '@app/store/settings/reducers/settings.reducer';
import { shikimoriReducer } from '@app/store/shikimori/reducers/shikimori.reducer';

const storeConfig: RootStoreConfig<AppStoreInterface> = {
    metaReducers: [
        authLocalStorageSyncReducer,
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
            auth: authReducer,
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
        Actions,
        ElectronIpcProxyService,
        ShikimoriClient,
        AuthWebExtensionEffects,
        AuthNativeAppEffects,
        {
            provide: USER_PROVIDED_EFFECTS,
            useFactory: authEffectFactory,
            multi: true,
        },
    ],
})
export class AppStateModule {}
