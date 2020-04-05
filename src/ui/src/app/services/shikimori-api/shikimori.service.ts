import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Shikimori} from '../../types/shikimori';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShikimoriService {

  private SHIKIMORI_URL: string = 'https://shikimori.one';

  constructor(
    private http: HttpClient
  ) {}

  public createUserRates(userRate: Shikimori.UserRate): Observable<Shikimori.UserRate> {
    return this.http.post<Shikimori.UserRate>(`${this.SHIKIMORI_URL}/api/v2/user_rates`, userRate, { withCredentials: true });
  }

  public getUserRates(params: HttpParams): Observable<Shikimori.UserRate[]> {
    return this.http.get<Shikimori.UserRate[]>(`${this.SHIKIMORI_URL}/api/v2/user_rates`, { params, withCredentials: true })
      .pipe(
        catchError(() => of([]))
      );
  }

  public setUserRates(userRate: Shikimori.UserRate): Observable<Shikimori.UserRate> {
    const id = userRate.id;

    return this.http.put<Shikimori.UserRate>(`${this.SHIKIMORI_URL}/api/v2/user_rates/${id}`, userRate, { withCredentials: true })
      .pipe(
        catchError(err => { console.warn(err); return of({}) })
      );
  }

  public incUserRates(userRate: Shikimori.UserRate): Observable<Shikimori.UserRate> {
    return this.http.post(`${this.SHIKIMORI_URL}/api/v2/user_rates/${userRate.id}/increment`, {}, { withCredentials: true });
  }

  public whoAmI(headers: HttpHeaders): Observable<Shikimori.User> {
    return this.http.get<Shikimori.User>(`${this.SHIKIMORI_URL}/api/users/whoami`, { headers, withCredentials: true });
  }

  public getUserInfo(user: string | number, params?: HttpParams): Observable<Shikimori.User> {
    const isNickname = !/^\d+$/.test(`${user}`);

    if (params && isNickname) {
      params.set('is_nickname', '1');
    } else if (isNickname) {
      params = new HttpParams().set('is_nickname', '1');
    }

    return this.http.get<Shikimori.User>(`${this.SHIKIMORI_URL}/api/users/${user}`, { params })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const deletedOrRenamedUser = new Shikimori.User({ avatar: 'https://shikimori.one/favicon.ico', nickname: user});

          return err.status === 404 ? of(deletedOrRenamedUser) : throwError(err)
        })
      );
  }

  public getAnime(animeId: number): Observable<Shikimori.Anime> {
    return this.http.get<Shikimori.Anime>(`${this.SHIKIMORI_URL}/api/animes/${animeId}`);
  }

  public async getNewToken(): Promise<Shikimori.Token> {
    return new Promise(async (resolve, reject) => {
      const code = await this._getShikimoriAuthCode() || null;
      const params = new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('client_id', environment.SHIKIMORI_CLIENT_ID)
        .set('client_secret', environment.SHIKIMORI_CLIENT_SECRET)
        .set('code', code)
        .set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');

      if (code) {
        this.http.post<Shikimori.IToken>('https://shikimori.one/oauth/token', null, { params })
          .subscribe(
            async (token) => {
              const shikimoriToken = new Shikimori.Token(token.access_token, token.refresh_token, token.created_at, token.expires_in);
              resolve(shikimoriToken);
            }
          );
      } else {
        reject();
      }
    });
  }

  public getRefreshedToken(oldToken: Shikimori.Token): Promise<Shikimori.Token> {
    const params = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', environment.SHIKIMORI_CLIENT_ID)
      .set('client_secret', environment.SHIKIMORI_CLIENT_SECRET)
      .set('refresh_token', oldToken.resfresh);

    return this.http.post<Shikimori.IToken>('https://shikimori.one/oauth/token', null,{ params })
      .pipe(
        map((token) => new Shikimori.Token(token.access_token, token.refresh_token, token.created_at, token.expires_in))
      ).toPromise();
  }

  private _getShikimoriAuthCode(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let codeUrl = new URL('https://shikimori.one/oauth/authorize?');
      codeUrl.searchParams.set('client_id', environment.SHIKIMORI_CLIENT_ID);
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
            if (!changeInfo.url)
              return;

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
