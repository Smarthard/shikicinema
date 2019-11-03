import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable, throwError} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {catchError} from 'rxjs/operators';
import {NotificationsService} from '../../services/notifications/notifications.service';
import {Notification, NotificationType} from '../../types/notification';

export class HttpRequestsInterceptor implements HttpInterceptor {

  private EXTENSION_VERSION = chrome.runtime.getManifest().version;

  constructor(
    private auth: AuthService,
    private notify: NotificationsService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this._handle(req, next));
  }

  private async _handle(req: HttpRequest<any>, next: HttpHandler) {
    const headers = { 'User-Agent': `Shikicinema ${this.EXTENSION_VERSION}` };
    const shikivideos = await this.auth.shikivideos;
    const shikimori = await this.auth.shikimori;

    switch (true) {
      case /smarthard/i.test(req.url) && req.method === 'POST':
        headers['Authorization'] = `Bearer ${shikivideos.token}`;
        break;
      case /shikimori/i.test(req.url) && !req.url.match(/oauth/i):
        headers['Authorization'] = `Bearer ${shikimori.token}`;
        break;
    }

    req = req.clone({ setHeaders: headers, withCredentials: false });

    return next.handle(req)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.notify.add(
              new Notification(
                NotificationType.WARNING,
                `Предыдущий запрос был неавторизован, мы обновили токен\nПожалуйста, попробуйте снова`
              )
            );
            if (/smarthard/i.test(req.url)) {
              this.auth.shikivideosSync();
            } else {
              this.auth.refreshShikimoriToken();
            }
          }

          return throwError(err);
        })
      )
      .toPromise();
  }
}
