import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  skipWhile,
  switchMap,
  take,
  timeout,
} from 'rxjs/operators';
import { EMPTY, merge, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShikimoriDomainsService {
  constructor(
    private readonly http: HttpClient,
  ) {}

  public detect(...extraDomains: string[]) {
    const domainsRequests = [...extraDomains]
      .map((domain) => this.http.get(`${domain}/api/constants/anime`, { observe: 'response' })
        .pipe(
          timeout(5000),
          switchMap(({ ok = false }) => ok ? of(domain) : EMPTY),
          catchError(() => EMPTY)
        )
      );

    return merge(...domainsRequests)
      .pipe(
        skipWhile((domain) => domain === null),
        take(1),
      );
  }
}
