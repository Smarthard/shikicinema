import { Observable, map } from 'rxjs';
import { Pipe, PipeTransform, inject } from '@angular/core';

import { SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';

@Pipe({
    name: 'getShikimoriPage',
    standalone: true,
})
export class GetShikimoriPagePipe implements PipeTransform {
    readonly shikimoriDomain$: Observable<string> = inject(SHIKIMORI_DOMAIN_TOKEN);

    transform(path: string | number): Observable<string> {
        const pathStr = `${path}`;
        const normilizedPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;

        return this.shikimoriDomain$.pipe(
            map((shikimoriDomain) => `${shikimoriDomain}${normilizedPath}`),
        );
    }
}
