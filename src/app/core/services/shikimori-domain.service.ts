import {
    EMPTY,
    Observable,
    of,
    race,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
    catchError,
    first,
    switchMap,
    take,
    timeout,
} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ShikimoriDomainsService {
    private readonly http = inject(HttpClient);

    public detect(...extraDomains: string[]): Observable<string> {
        const domainsRequests = [...extraDomains]
            .map((domain) => this.http.get(`${domain}/api/constants/anime`, { observe: 'response' })
                .pipe(
                    timeout(5000),
                    switchMap(({ ok = false }) => ok ? of(domain) : EMPTY),
                    catchError(() => EMPTY),
                ),
            );

        return race(...domainsRequests)
            .pipe(
                first((domain) => Boolean(domain)),
                take(1),
            );
    }
}
