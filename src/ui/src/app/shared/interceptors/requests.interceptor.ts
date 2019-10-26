import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
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
            this.notify.add(
              new Notification(
                NotificationType.WARNING,
                `Предыдущий запрос был неавторизован, мы обновили токен\nПожалуйста, попробуйте снова`
              )
            );
            this.auth.resfresh(/smarthard/i.test(req.url) ? this.auth.shikivideos : this.auth.shikimori);
          }

          return throwError(err);
        })
      );
  }
}
