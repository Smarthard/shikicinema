import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {catchError} from 'rxjs/operators';

export class HttpRequestsInterceptor implements HttpInterceptor {

  private EXTENSION_VERSION = chrome.runtime.getManifest().version;

  constructor(
    private auth: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = { 'User-Agent': `Shikicinema ${this.EXTENSION_VERSION}` };

    switch (true) {
      case /smarthard/i.test(req.url) && /oauth/i.test(req.url):
        headers['Authorization'] = `Bearer ${this.auth.shikivideos.token}`;
        break;
      case /shikimori/i.test(req.url) && /oauth/i.test(req.url):
        headers['Authorization'] = `Bearer ${this.auth.shikimori.token}`;
        break;
      default:
        break;
    }

    req = req.clone({ setHeaders: headers, withCredentials: false });

    return next.handle(req)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401 || err.status === 500) {
            this.auth.resfresh(/smarthard/i.test(req.url) ? this.auth.shikivideos : this.auth.shikimori);
          }

          return throwError(err);
        })
      );
  }
}
