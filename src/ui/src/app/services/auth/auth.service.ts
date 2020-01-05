import {Injectable} from '@angular/core';
import {StorageService} from '../chrome-storage/storage.service';
import {SmarthardNet} from '../../types/smarthard-net';
import {Shikimori} from '../../types/shikimori';
import {ReplaySubject} from 'rxjs';
import {ShikimoriService} from '../shikimori-api/shikimori.service';
import {NotificationsService} from '../notifications/notifications.service';
import {Notification, NotificationType} from '../../types/notification';
import {ShikivideosService} from '../shikivideos-api/shikivideos.service';

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

  constructor(
    private shikimoriService: ShikimoriService,
    private shikivideosService: ShikivideosService,
    private notify: NotificationsService
  ) {
    StorageService.get<SmarthardNet.IToken>('sync', 'videoToken')
      .subscribe(token => {
        const shikivideos = token
          ? new SmarthardNet.Token(token.access_token, token.expires)
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

  public shikimoriSync() {
    if (!this.shikimori.resfresh) {
      this.shikimoriService.getNewToken()
        .then(token => this._updateShikimoriToken(token))
        .catch(() => this.notify.add(new Notification(NotificationType.ERROR, 'Войдите в свой аккаунт на Шикимори')))
    } else {
      this.shikimoriService.getRefreshedToken(this.shikimori)
        .then(token => this._updateShikimoriToken(token))
    }
  }

  public async shikimoriDrop() {
    this.shikimoriToken.next(new Shikimori.Token());
    await StorageService.set('sync', { shikimoriToken: {} }).toPromise();
  }

  public async shikivideosSync(): Promise<void> {
    this.shikivideosService.getNewToken()
      .subscribe(async (token) => {
          this.videoToken.next(token);
          await StorageService.set('sync', { videoToken: token }).toPromise();
      });
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
