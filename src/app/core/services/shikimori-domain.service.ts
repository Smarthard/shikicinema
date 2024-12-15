import {
    EMPTY,
    Observable,
    merge,
    of,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    catchError,
    distinctUntilChanged,
    shareReplay,
    skipWhile,
    switchMap,
    take,
    timeout,
} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ShikimoriDomainsService {
    constructor(
        private readonly http: HttpClient,
    ) {}

    public detect(...extraDomains: string[]): Observable<string> {
        const domainsRequests = [...extraDomains]
            .map((domain) => this.http.get(`${domain}/api/constants/anime`, { observe: 'response' })
                .pipe(
                    timeout(5000),
                    switchMap(({ ok = false }) => ok ? of(domain) : EMPTY),
                    catchError(() => EMPTY),
                ),
            );

        return merge(...domainsRequests)
            .pipe(
                skipWhile((domain) => domain === null),
                take(1),
                distinctUntilChanged(),
                shareReplay(1),
            );
    }
}
