import {EMPTY, Observable, throwError} from 'rxjs';
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

            // Update shikimori token and retry
            // or update it with shikivideos token and retry
            if (err.status === 403) {
              return this.auth.shikimoriSync()
                .pipe(
                  exhaustMap(() => {
                    if (/token/i.test(req.url)) {
                      req = req.clone({ body: { shikimori_token: this.auth.shikimori.token } });
                      return next.handle(req);
                    } else {
                      return exhaustMap(() => this.auth.shikivideosSync()
                        .pipe(exhaustMap(() => next.handle(req))));
                    }
                  })
                );
            }

            // Forcefully update shikivideos token and drop previous request
            if (err.status === 401 && req.params.get('grant_type') === 'refresh_token') {
              return this.auth.shikivideosSync(true)
                .pipe(
                  exhaustMap(() => EMPTY)
                );
            }

            // Update shikivideos token and retry
            // Show notification on error
            if (err.status === 401 && req.method === 'POST') {
              return this.auth.shikivideosSync()
                .pipe(
                  catchError(() => {
                    this._showWarningNotification();
                    return EMPTY;
                  }),
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
