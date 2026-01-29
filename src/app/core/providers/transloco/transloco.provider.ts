import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
    Translation,
    TranslocoLoader,
    provideTransloco,
} from '@jsverse/transloco';

import { environment } from '@app-env/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string) {
        return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
    }
}

export const defaultAvailableLangs = ['en', 'ru', 'uk'];

export function provideTranslocoRoot() {
    return [
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
    ];
}
