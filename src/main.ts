import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideScrollbarPolyfill } from 'ngx-scrollbar';

import { AppComponent } from '@app/app.component';
import { CachedAnimeInterceptor } from '@app/shared/interceptors/cached-animes.interceptor';
import { DEFAULT_SHIKIMORI_DOMAIN, DEFAULT_SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import {
    ElectronIpcProxyService,
    PLATFORM_API_TOKEN,
    ShikimoriClient,
    platformApiFactory,
} from '@app/shared/services';
import { ShikicinemaApiInterceptor } from '@app/shared/interceptors/shikicinema-api.interceptor';
import { ShikimoriApiInterceptor } from '@app/shared/interceptors/shikimori-api.interceptor';
import { environment } from '@app-root/environments/environment';
import { provideAppRouting } from '@app/app-routing.provider';
import { provideAppState } from '@app/store/app-state.providers';
import { provideIonicStorage } from '@app/core/providers/ionic-storage/ionic-storage.provider';
import { provideTranslocoRoot } from '@app/core/providers/transloco/transloco.provider';

if (environment.isProduction) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideExperimentalZonelessChangeDetection(),
        provideIonicAngular({ mode: 'md' }),
        provideAppRouting(),
        provideAppState(),
        provideTranslocoRoot(),
        provideScrollbarPolyfill('assets/scroll-timeline-polyfill.js'),
        provideHttpClient(
            withFetch(),
            withInterceptorsFromDi(),
        ),
        provideAnimations(),
        provideIonicStorage(),
        ShikimoriClient,
        { provide: PLATFORM_API_TOKEN, useFactory: platformApiFactory, deps: [ElectronIpcProxyService] },
        { provide: DEFAULT_SHIKIMORI_DOMAIN_TOKEN, useValue: DEFAULT_SHIKIMORI_DOMAIN },
        { provide: HTTP_INTERCEPTORS, useClass: ShikimoriApiInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ShikicinemaApiInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CachedAnimeInterceptor, multi: true },
    ],
}).catch((err) => console.log(err));
