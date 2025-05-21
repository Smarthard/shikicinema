import { Observable, map } from 'rxjs';
import { Pipe, PipeTransform, inject } from '@angular/core';

import { SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';

@Pipe({
    name: 'getShikimoriPage',
    standalone: true,
})
export class GetShikimoriPagePipe implements PipeTransform {
    readonly shikimoriDomain$: Observable<string> = inject(SHIKIMORI_DOMAIN_TOKEN);

    transform(path: string): Observable<string> {
        const normilizedPath = path?.startsWith('/') ? path : `/${path}`;

        return this.shikimoriDomain$.pipe(
            map((shikimoriDomain) => `${shikimoriDomain}${normilizedPath}`),
        );
    }
}
