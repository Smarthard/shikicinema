import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError, delay, exhaustMap, switchMap} from 'rxjs/operators';
import {SmarthardNet} from '../../types/smarthard-net';
import {AuthService} from '../../services/auth/auth.service';
import {NotificationsService} from '../../services/notifications/notifications.service';
import {environment} from '../../../environments/environment';
import {Notification, NotificationType} from '../../types/notification';
import {Shikimori} from '../../types/shikimori';

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

  private static _updateTokenReq(req: HttpRequest<any>, shikimoriToken: Shikimori.Token): HttpRequest<any> {
    const body: any = { shikimori_token: shikimoriToken.token };

    return req.clone({ body });
  }

  private static _switchTokenReq(req: HttpRequest<any>, shikimoriToken: Shikimori.Token): HttpRequest<any> {
    const params = new HttpParams()
      .set('grant_type', 'shikimori_token')
      .set('client_id', environment.SHIKIVIDEOS_CLIENT_ID)
      .set('client_secret', environment.SHIKIVIDEOS_CLIENT_SECRET)
      .set('scopes', 'database:shikivideos_create');

    return req.clone({
      method: 'PUT',
      params,
      body: { shikimori_token: shikimoriToken.token }
    });
  }

  private _appendHeaders(request: HttpRequest<any>, token?: SmarthardNet.Token): HttpRequest<any> {
    const EXTENSION_VERSION = this.EXTENSION_VERSION;
    const DEV_LABEL = this.IS_PRODUCTION ? '' : ' DEV';
    const shikivideos = token || this.auth.shikivideos;
    let headers = new HttpHeaders({ 'User-Agent': `Shikicinema ${EXTENSION_VERSION}${DEV_LABEL}`});

    if (request.method === 'POST' && shikivideos && shikivideos.token) {
      headers = headers.append('Authorization', `Bearer ${shikivideos.token}`);
    }

    return request.clone({ headers, withCredentials: false });
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

            // Update shikimori token -> update shikivideos token and retry if needed
            if (err.status === 403) {
              return this.auth.shikimoriSync()
                .pipe(
                  delay(200),
                  exhaustMap((token: Shikimori.Token) => {
                    if (/token/i.test(req.url)) {
                      return next.handle(ShikivideosRequestsInterceptor._updateTokenReq(req, token))
                    } else {
                      return this.auth.shikivideosSync()
                        .pipe(
                          exhaustMap(() => next.handle(req))
                        )
                    }
                  })
                );
            }

            // Forcefully update shikimori token and retry
            if (err.status === 401 && req.params.get('grant_type') === 'refresh_token') {
              return this.auth.shikimoriSync()
                .pipe(
                  delay(200),
                  exhaustMap((token: Shikimori.Token) => next.handle(ShikivideosRequestsInterceptor._switchTokenReq(req, token))),
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
