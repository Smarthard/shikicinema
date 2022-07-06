import { NgModule } from '@angular/core';
import { Actions, EffectsModule, USER_PROVIDED_EFFECTS } from '@ngrx/effects';
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
import { authReducer } from '@app/store/auth/reducers/auth.reducer';
import { authEffectFactory } from '@app/store/auth/factories/auth-effects.factories';
import { authLocalStorageSyncReducer } from '@app/store/auth/reducers/auth.meta-reducer';
import { AuthWebExtensionEffects } from '@app/store/auth/effects/auth.web-extension.effects';
import { AuthNativeAppEffects } from '@app/store/auth/effects/auth.native-app.effects';
import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';

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
