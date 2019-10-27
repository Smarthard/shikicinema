import {Injectable} from '@angular/core';
import {StorageService} from '../chrome-storage/storage.service';
import {SmarthardNet} from '../../types/smarthard-net';
import {Shikimori} from '../../types/shikimori';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AbstractToken} from '../../types/abstract-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static SHIKIVIDEOS_CLIENT_ID: string = environment.SHIKIVIDEOS_CLIENT_ID;
  private static SHIKIVIDEOS_CLIENT_SECRET: string = environment.SHIKIVIDEOS_CLIENT_SECRET;
  private static SHIKIMORI_CLIENT_ID: string = environment.SHIKIMORI_CLIENT_ID;
  private static SHIKIMORI_CLIENT_SECRET: string = environment.SHIKIMORI_CLIENT_SECRET;

  private videoToken: SmarthardNet.Token = new SmarthardNet.Token();
  private shikimoriToken: Shikimori.Token = new Shikimori.Token();

  constructor(
    private http: HttpClient
  ) {
    StorageService.get<SmarthardNet.Token>('sync', 'videoToken')
      .subscribe(token => this.videoToken = new SmarthardNet.Token(token));

    StorageService.get<Shikimori.Token>('sync', 'shikimoriToken')
      .subscribe(token => this.shikimoriToken = new Shikimori.Token(token));
  }

  public get shikivideos(): SmarthardNet.Token {
    return this.videoToken;
  }

  public get shikimori(): Shikimori.Token {
    return this.shikimoriToken;
  }

  public resfresh(token: AbstractToken) {
    if (token instanceof SmarthardNet.Token) {
      const params = new HttpParams()
        .set('grant_type', 'client_credentials')
        .set('client_id', AuthService.SHIKIVIDEOS_CLIENT_ID)
        .set('client_secret', AuthService.SHIKIVIDEOS_CLIENT_SECRET)
        .set('scopes', 'database:shikivideos_create');

      this.http.get('https://smarthard.net/oauth/token', {params})
        .subscribe(
          async (token) => {
            this.videoToken = new SmarthardNet.Token(token);
            await StorageService.set('sync', { videoToken: this.videoToken }).toPromise();
          }
        );
    }

    if (token instanceof Shikimori.Token) {
      const params = new HttpParams()
        .set('grant_type', 'refresh_token')
        .set('client_id', AuthService.SHIKIMORI_CLIENT_ID)
        .set('client_secret', AuthService.SHIKIMORI_CLIENT_SECRET)
        .set('refresh_token', this.shikimori.resfresh);

      this.http.get('https://shikimori.one/oauth/token', { params })
        .subscribe(
          async (token) => {
            this.shikimoriToken = new Shikimori.Token(token);
            await StorageService.set('sync', { shikimoriToken: this.shikimoriToken }).toPromise();
          }
        );
    }
  }

  public async shikimoriSync() {
    const code = await this._getShikimoriAuthCode() || null;
    const params = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', AuthService.SHIKIMORI_CLIENT_ID)
      .set('client_secret', AuthService.SHIKIMORI_CLIENT_SECRET)
      .set('code', code)
      .set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');

    if (code) {
      this.http.get('https://shikimori.one/oauth/token', { params })
        .subscribe(
          token => this.shikimoriToken = new Shikimori.Token(token)
        );
    }
  }

  public shikivideosSync() {
    if (!this.shikivideos.token || this.shikivideos.expired) {
      this.resfresh(new SmarthardNet.Token());
    }
  }

  private _getShikimoriAuthCode(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let codeUrl = new URL('https://shikimori.one/oauth/authorize?');
      codeUrl.searchParams.set('client_id', AuthService.SHIKIMORI_CLIENT_ID);
      codeUrl.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');
      codeUrl.searchParams.set('response_type', 'code');

      chrome.tabs.query({active: true}, ([selectedTab]) =>
        chrome.tabs.create({active: true, url: codeUrl.toString()}, new_tab => {

          const onRemove = (tabId) => {
            if (tabId === new_tab.id) {
              reject({error: 'tab-removed'});
              removeListeners();
            }
          };

          const onUpdate = (tabId, changeInfo) => {
            const tabUrl = new URL(changeInfo.url);
            const error = tabUrl.searchParams.get('error');
            const message = tabUrl.searchParams.get('error_description');
            const code = tabUrl.toString().split('authorize/')[1];

            if (tabId !== new_tab.id || !changeInfo.url || tabUrl.toString().includes('response_type'))
              return;

            if (error || message) {
              reject({ error, message });
            } else {
              resolve(code);
            }

            removeListeners();
            chrome.tabs.update(
              selectedTab.id,
              { active: true },
              () => chrome.tabs.remove(new_tab.id)
            );
          };

          const removeListeners = () => {
            chrome.tabs.onRemoved.removeListener(onRemove);
            chrome.tabs.onUpdated.removeListener(onUpdate);
          };

          chrome.tabs.onRemoved.addListener(onRemove);
          chrome.tabs.onUpdated.addListener(onUpdate);
        })
      );
    });
  }


}
