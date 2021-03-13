import {Injectable} from '@angular/core';
import {ShikimoriThrottleService} from '../../services/shikimori-api/shikimori-throttle.service';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShikimoriApiThrottleInterceptor {
  constructor(
    private shikimoriTrottleService: ShikimoriThrottleService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (/shikimori/i.test(req.url) && !req.url.match(/oauth/i)) {
      return this.shikimoriTrottleService.intercept(req, next);
    } else {
      return next.handle(req);
    }
  }
}
