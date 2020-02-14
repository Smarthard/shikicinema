import {Observable, throwError} from 'rxjs';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../../services/auth/auth.service';
import {NotificationsService} from '../../services/notifications/notifications.service';
import {environment} from '../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Notification, NotificationType} from '../../types/notification';
import {Shikimori} from '../../types/shikimori';

@Injectable({
  providedIn: 'root'
})
export class ShikimoriRequestsInterceptor implements HttpInterceptor {

  private EXTENSION_VERSION = chrome.runtime.getManifest().version;
  private IS_PRODUCTION = environment.production;

  constructor(
    private auth: AuthService,
    private notify: NotificationsService
  ) {}

  private _updateToken(): Observable<Shikimori.Token> {
    return this.auth.shikimoriSync();
  }

  private _appendHeaders(request: HttpRequest<any>, token?: Shikimori.Token): HttpRequest<any> {
    const headers = { 'User-Agent': `Shikicinema ${this.EXTENSION_VERSION}${this.IS_PRODUCTION ? '' : ' DEV'}`};
    const shikimori = token || this.auth.shikimori;

    if (shikimori && shikimori.token) {
      headers['Authorization'] = `Bearer ${shikimori.token}`;
    }

    return request.clone({ setHeaders: headers, withCredentials: false });
  }

  private _showWarningNotification() {
    this.notify.add(
      new Notification(
        NotificationType.WARNING,
        `Не удалось синхронизироваться с Шикимори :(`
      )
    );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (/shikimori/i.test(req.url) && !req.url.match(/oauth/i)) {
      req = this._appendHeaders(req);

      return next.handle(req)
        .pipe(
          catchError((err: HttpErrorResponse) => {

            if (err.status === 401) {
              return this._updateToken()
                .pipe(
                  switchMap((token) => {
                    req = this._appendHeaders(req, token);
                    return next.handle(req);
                  })
                );
            }

            if (req.method === 'POST') {
              this._showWarningNotification();
            }
            return throwError(err);
          })
        )
    }

    return next.handle(req);
  }

}