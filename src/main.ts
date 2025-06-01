import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideScrollbarPolyfill } from 'ngx-scrollbar';

import { AppComponent } from '@app/app.component';
import {
    ElectronIpcProxyService,
    PLATFORM_API_TOKEN,
    ShikimoriClient,
    platformApiFactory,
} from '@app/shared/services';
import { SHIKIMORI_DOMAIN_TOKEN, shikimoriDomainFactory } from '@app/core/providers/shikimori-domain';
import { ShikimoriDomainsService } from '@app/core/services/shikimori-domain.service';
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
        provideIonicAngular({ mode: 'md' }),
        provideAppRouting(),
        provideAppState(),
        provideTranslocoRoot(),
        provideScrollbarPolyfill('assets/scroll-timeline-polyfill.js'),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideIonicStorage(),
        ShikimoriClient,
        { provide: PLATFORM_API_TOKEN, useFactory: platformApiFactory, deps: [ElectronIpcProxyService] },
        { provide: SHIKIMORI_DOMAIN_TOKEN, useFactory: shikimoriDomainFactory, deps: [ShikimoriDomainsService] },
    ],
}).catch((err) => console.log(err));
