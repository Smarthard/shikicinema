import { Observable } from 'rxjs';

import { ShikimoriDomainsService } from '@app/core/services/shikimori-domain.service';

export const shikimoriDomainFactory = (shikimoriDomainService: ShikimoriDomainsService): Observable<string> => {
    return shikimoriDomainService.detect(
        'https://shikimori.one',
        'https://shikimori.me',
        'https://shikimori.org',
    );
};
