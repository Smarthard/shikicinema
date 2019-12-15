import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Shikimori} from '../../types/shikimori';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {SmarthardNet} from '../../types/smarthard-net';

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
    return this.http.put<Shikimori.UserRate>(`${this.SHIKIMORI_URL}/api/v2/user_rates/${userRate.id}`, userRate, { withCredentials: true })
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

    return this.http.get<Shikimori.User>(`${this.SHIKIMORI_URL}/api/users/${user}`, { params });
  }

  public getAnime(animeId: number): Observable<SmarthardNet.Shikivideo> {
    return this.http.get<SmarthardNet.Shikivideo>(`${this.SHIKIMORI_URL}/api/animes/${animeId}`);
  }
}
