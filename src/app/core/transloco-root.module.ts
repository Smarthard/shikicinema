import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import {
    Translation,
    TranslocoLoader,
    TranslocoModule,
    provideTransloco,
} from '@ngneat/transloco';

import { environment } from '@app-env/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    constructor(private http: HttpClient) {}

    getTranslation(lang: string) {
        return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
    }
}

export const defaultAvailableLangs = ['en', 'ru', 'uk'];

@NgModule({
    exports: [TranslocoModule],
    providers: [
        provideHttpClient(),
        provideTransloco({
            config: {
                availableLangs: defaultAvailableLangs,
                defaultLang: 'en',
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                prodMode: environment.isProduction,
            },
            loader: TranslocoHttpLoader,
        }),
    ],
})
export class TranslocoRootModule {}
