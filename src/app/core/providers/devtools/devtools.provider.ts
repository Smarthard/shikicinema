import { EnvironmentProviders } from '@angular/core';
import { StoreDevtoolsOptions, provideStoreDevtools } from '@ngrx/store-devtools';

import { environment } from '@app-env/environment';

const storeDevtoolsConfig: StoreDevtoolsOptions = {
    name: 'Shikicinema State Devtools',
    maxAge: 100,
    logOnly: environment.isProduction,
};

export function provideDevtools(): EnvironmentProviders[] {
    return [
        provideStoreDevtools(storeDevtoolsConfig),
    ];
}
