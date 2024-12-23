import { Actions, EffectsModule, USER_PROVIDED_EFFECTS } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { RootStoreConfig, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';

import { AppStoreInterface } from '@app/store/app-store.interface';
import { AuthNativeAppEffects } from '@app/store/auth/effects/auth.native-app.effects';
import { AuthWebExtensionEffects } from '@app/store/auth/effects/auth.web-extension.effects';
import { CacheEffects } from '@app/store/cache/effects/cache.effects';
import { ElectronIpcProxyService } from '@app/shared/services/electron-ipc-proxy.service';
import { SettingsEffects } from '@app/store/settings/effects/settings.effects';
import { ShikicinemaEffects } from '@app/store/shikicinema/effects/shikicinema.effects';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { ShikimoriEffects } from '@app/store/shikimori/effects/shikimori.effects';
import { authEffectFactory } from '@app/store/auth/factories/auth-effects.factories';
import { authLocalStorageSyncReducer } from '@app/store/auth/reducers/auth.meta-reducer';
import { authReducer } from '@app/store/auth/reducers/auth.reducer';
import { cacheLocalStorageSyncReducer } from '@app/store/cache/reducers/cache.meta-reducer';
import { cacheReducer } from '@app/store/cache/reducers/cache.reducer';
import { environment } from '@app-env/environment';
import { loggerMetaReducer } from '@app/store/logger/reducers/logger.meta-reducer';
import { settingsLocalStorageSyncReducer } from '@app/store/settings/reducers/settings.meta-reducer';
import { settingsReducer } from '@app/store/settings/reducers/settings.reducer';
import { shikicinemaLocalStorageSyncReducer } from '@app/store/shikicinema/reducers/shikicinema.meta-reducer';
import { shikicinemaReducer } from '@app/store/shikicinema/reducers/shikicinema.reducer';
import { shikimoriReducer } from '@app/store/shikimori/reducers/shikimori.reducer';

const storeConfig: RootStoreConfig<AppStoreInterface> = {
    metaReducers: [
        authLocalStorageSyncReducer,
        cacheLocalStorageSyncReducer,
        settingsLocalStorageSyncReducer,
        shikicinemaLocalStorageSyncReducer,
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
            shikicinema: shikicinemaReducer,
            cache: cacheReducer,
        }, storeConfig),
        EffectsModule.forRoot([
            SettingsEffects,
            ShikimoriEffects,
            ShikicinemaEffects,
            CacheEffects,
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
