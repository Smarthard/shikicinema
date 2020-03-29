import {Observable, throwError} from 'rxjs';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {SmarthardNet} from '../../types/smarthard-net';
import {AuthService} from '../../services/auth/auth.service';
import {NotificationsService} from '../../services/notifications/notifications.service';
import {environment} from '../../../environments/environment';
import {catchError, exhaustMap, switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Notification, NotificationType} from '../../types/notification';

@Injectable({
  providedIn: 'root'
})
export class ShikivideosRequestsInterceptor implements HttpInterceptor {

  private EXTENSION_VERSION = chrome.runtime.getManifest().version;
  private IS_PRODUCTION = environment.production;

  constructor(
    private auth: AuthService,
    private notify: NotificationsService
  ) {}

  private _updateToken(): Observable<SmarthardNet.Token> {
    return this.auth.shikivideosSync();
  }

  private _appendHeaders(request: HttpRequest<any>, token?: SmarthardNet.Token): HttpRequest<any> {
    const headers = { 'User-Agent': `Shikicinema ${this.EXTENSION_VERSION}${this.IS_PRODUCTION ? '' : ' DEV'}`};
    const shikivideos = token || this.auth.shikivideos;

    if (request.method === 'POST' && shikivideos && shikivideos.token) {
      headers['Authorization'] = `Bearer ${shikivideos.token}`;
    }

    return request.clone({ setHeaders: headers, withCredentials: false });
  }

  private _showWarningNotification() {
    this.notify.add(
      new Notification(
        NotificationType.WARNING,
        `Не удалось связаться с видео-архивом :(`
      )
    );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (/smarthard/i.test(req.url)) {
      req = this._appendHeaders(req);

      return next.handle(req)
        .pipe(
          catchError((err: HttpErrorResponse) => {

            if (err.status === 403) {
              return this.auth.shikimoriSync()
                .pipe(
                  exhaustMap(() => this.auth.shikivideosSync()),
                  exhaustMap(() => next.handle(req))
                );
            }

            if (err.status === 401 && req.params.get('grant_type') === 'refresh_token') {
              return this.auth.shikivideosSync(true)
                .pipe(
                  exhaustMap(() => next.handle(req))
                );
            }

            if (err.status === 401 && req.method === 'POST') {
              this._showWarningNotification();

              return this._updateToken()
                .pipe(
                  switchMap((token) => {
                    req = this._appendHeaders(req, token);
                    return next.handle(req);
                  })
                );
            }

            return throwError(err);
          })
        );
    }

    return next.handle(req);
  }

}
