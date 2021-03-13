import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, Subscriber} from 'rxjs';
import {catchError, concatMap, tap} from 'rxjs/operators';

const THROTTLE_LIMIT = 4;

@Injectable({
  providedIn: 'root',
})
export class ShikimoriThrottleService {
  private activeCount = 0;
  private reqURLs = [];
  private reqObs: { [key: string]: Subscriber<any> } = {};

  processResponse() {
    if (this.activeCount > 0) {
      this.activeCount--;
    }

    if (this.reqURLs.length > 0) {
      const url = this.reqURLs[0];
      const observer = this.reqObs[url];

      observer.next('done');
      observer.complete();

      this.reqURLs = this.reqURLs.slice(1);
      delete this.reqObs[url];
    }
  }

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const url = req.url;
    const index = this.reqURLs.indexOf(url);

    if (index > -1) {
      this.reqURLs.splice(index, 1);
      const observer = this.reqObs[url];
      observer.error();
      delete this.reqObs[url];

      if (this.activeCount > 0) {
        this.activeCount--;
      }
    }

    if (this.activeCount < THROTTLE_LIMIT) {
      this.activeCount++;
      return next.handle(req).pipe(
        tap(evt => {
          if (evt instanceof HttpResponse) {
            this.processResponse();
          }
          return evt;
        }),
        catchError(err => {
          this.processResponse();
          return of(err);
        }),
      );
    } else {
      this.reqURLs.push(url);
      this.reqObs[url] = null;
      const obs = new Observable(ob => {
        this.reqObs[url] = ob;
      });

      return obs.pipe(
        concatMap(_ => {
          return next.handle(req).pipe(
            tap(evt => {
              if (evt instanceof HttpResponse) {
                this.processResponse();
              }
              return evt;
            }),
            catchError(err => {
              this.processResponse();
              return of(err);
            }),
          );
        })
      );
    }
  }
}
