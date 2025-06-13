import {
    Observable,
    catchError,
    of,
    timeout,
} from 'rxjs';
import { inject } from '@angular/core';

import { DEFAULT_SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain/default-shikimori-domain.token';
import { ShikimoriDomainsService } from '@app/core/services/shikimori-domain.service';

export const shikimoriDomainFactory = (): Observable<string> => {
    const shikimoriDomainService = inject(ShikimoriDomainsService);
    const defaultShikimoriDomain = inject(DEFAULT_SHIKIMORI_DOMAIN_TOKEN);

    return shikimoriDomainService.detect(
        'https://shikimori.one',
        'https://shikimori.me',
        'https://shikimori.org',
    ).pipe(
        timeout({ first: 10_000 }),
        catchError(() => of(defaultShikimoriDomain)),
    );
};
