import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    provideHttpClient,
    withFetch,
    withInterceptors,
} from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideScrollbarPolyfill } from 'ngx-scrollbar';

import { AppComponent } from '@app/app.component';
import { DEFAULT_SHIKIMORI_DOMAIN, DEFAULT_SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import {
    ElectronIpcProxyService,
    PLATFORM_API_TOKEN,
    platformApiFactory,
} from '@app/shared/services';
import {
    cachedAnimeInterceptor,
    shikicinemaApiInterceptor,
    shikimoriApiInterceptor,
} from '@app/shared/interceptors';
import { environment } from '@app-root/environments/environment';
import { provideAppRouting } from '@app/app-routing.provider';
import { provideAppState } from '@app/store/app-state.providers';
import { provideIonicStorage } from '@app/core/providers/ionic-storage/ionic-storage.provider';
import { provideIsSupportsAvif } from '@app/core/providers/avif';
import { provideTranslocoRoot } from '@app/core/providers/transloco/transloco.provider';

if (environment.isProduction) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        provideIonicAngular({ mode: 'md' }),
        provideAppRouting(),
        provideAppState(),
        provideTranslocoRoot(),
        provideScrollbarPolyfill('assets/scroll-timeline-polyfill.js'),
        provideHttpClient(
            withFetch(),
            withInterceptors([
                cachedAnimeInterceptor,
                shikicinemaApiInterceptor,
                shikimoriApiInterceptor,
            ]),
        ),
        provideAnimations(),
        provideIonicStorage(),
        provideIsSupportsAvif(),
        { provide: PLATFORM_API_TOKEN, useFactory: platformApiFactory, deps: [ElectronIpcProxyService] },
        { provide: DEFAULT_SHIKIMORI_DOMAIN_TOKEN, useValue: DEFAULT_SHIKIMORI_DOMAIN },
    ],
}).catch((err) => console.log(err));
