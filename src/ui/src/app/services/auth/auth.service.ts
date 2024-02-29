import { Injectable } from '@angular/core';
import { StorageService } from '../chrome-storage/storage.service';
import { SmarthardNet } from '../../types/smarthard-net';
import { Shikimori } from '../../types/shikimori';
import {
  EMPTY,
  from,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  throwIfEmpty,
} from 'rxjs';
import { ShikimoriService } from '../shikimori-api/shikimori.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Notification, NotificationType } from '../../types/notification';
import { ShikivideosService } from '../shikivideos-api/shikivideos.service';
import {
  catchError,
  shareReplay,
  tap,
} from 'rxjs/operators';
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private videoToken = new ReplaySubject<SmarthardNet.Token>(1);
  private shikimoriToken = new ReplaySubject<Shikimori.Token>(1);

  private _shikivideos: SmarthardNet.Token;
  private _shikimori: Shikimori.Token;

  public shikivideos$ = this.videoToken.asObservable();
  public shikimori$ = this.shikimoriToken.asObservable();

  readonly whoami$ = this.shikimoriService.whoAmI(new HttpHeaders()
    .set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma', 'no-cache')
  ).pipe(
    switchMap((user) => user ? of(user) : EMPTY),
    catchError(() => EMPTY),
    shareReplay(1),
  );

  constructor(
    private shikimoriService: ShikimoriService,
    private shikivideosService: ShikivideosService,
    private notify: NotificationsService
  ) {
    StorageService.get<SmarthardNet.IToken>('sync', 'videoToken')
      .subscribe(token => {
        const shikivideos = token
          ? new SmarthardNet.Token(token.access_token, token.expires, token.refresh_token)
          : new SmarthardNet.Token();
        this.videoToken.next(shikivideos);
      });

    StorageService.get<Shikimori.IToken>('sync', 'shikimoriToken')
      .subscribe(token => {
        const shikimori = token
          ? new Shikimori.Token(token.access_token, token.refresh_token, token.created_at, token.expires_in)
          : new Shikimori.Token();
        this.shikimoriToken.next(shikimori)
      });

    this.shikivideos$
      .subscribe(token => this._shikivideos = token);

    this.shikimori$
      .subscribe(token => this._shikimori = token);
  }

  public get shikivideos(): SmarthardNet.Token {
    return this._shikivideos;
  }

  public get shikimori(): Shikimori.Token {
    return this._shikimori;
  }

  public shikimoriSync(): Observable<Shikimori.Token> {
    if (!this.shikimori.resfresh || this.shikimori.expired) {
      return this.whoami$
        .pipe(
          throwIfEmpty(() => new Error('User is not logged in')),
          switchMap(() => from(this.shikimoriService.getNewToken())),
          tap((token) => this._updateShikimoriToken(token)),
          catchError((err: Error) => {
            console.warn(err);
            this.notify.add(new Notification(NotificationType.ERROR, 'Пожалуйста, войдите в свой аккаунт на Шикимори'));

            return EMPTY;
          })
        )
    } else {
      return from(this.shikimoriService.getRefreshedToken(this.shikimori))
        .pipe(
          tap((token) => this._updateShikimoriToken(token))
        )
    }
  }

  public async shikimoriDrop() {
    this.shikimoriToken.next(new Shikimori.Token());
    await StorageService.set('sync', { shikimoriToken: {} }).toPromise();
  }

  public shikivideosSync(forcedNew: boolean = false): Observable<SmarthardNet.Token> {
    if (!this.shikivideos.refresh || this.shikivideos.expired || forcedNew) {
      return this.whoami$
        .pipe(
          throwIfEmpty(() => new Error('User is not logged in')),
          switchMap(() => this.shikivideosService.getNewToken(this.shikimori)),
          tap(async (token) => {
            this.videoToken.next(token);
            await StorageService.set('sync', { videoToken: token }).toPromise();
          }),
          catchError((err: Error) => {
            console.warn(err);
            this.notify.add(new Notification(NotificationType.ERROR, 'Пожалуйста, войдите в свой аккаунт на Шикимори'));

            return EMPTY;
          })
        );
    } else {
      return this.shikivideosService.getRefreshedToken(this.shikivideos)
        .pipe(
          tap(async (token) => {
            this.videoToken.next(token);
            await StorageService.set('sync', { videoToken: token }).toPromise();
          })
        );
    }
  }

  public async shikivideosDrop() {
    this.videoToken.next(new SmarthardNet.Token());
    await StorageService.set('sync', { videoToken: {} }).toPromise();
  }

  private async _updateShikimoriToken(token: Shikimori.Token) {
    this.shikimoriToken.next(token);
    await StorageService.set('sync', { shikimoriToken: token }).toPromise();
  }

}
