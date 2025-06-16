import { Observable, map } from 'rxjs';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectShikimoriDomain } from '@app/store/shikimori/selectors';

@Pipe({
    name: 'getShikimoriPage',
    standalone: true,
})
export class GetShikimoriPagePipe implements PipeTransform {
    private readonly store = inject(Store);
    private readonly shikimoriDomain$ = this.store.select(selectShikimoriDomain);

    transform(path: string | number): Observable<string> {
        const pathStr = `${path}`;
        const normilizedPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;

        return this.shikimoriDomain$.pipe(
            map((shikimoriDomain) => `${shikimoriDomain}${normilizedPath}`),
        );
    }
}
