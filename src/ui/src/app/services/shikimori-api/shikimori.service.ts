import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Shikimori} from '../../types/shikimori';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

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

  public getAnime(animeId: number) {
    return this.http.get(`${this.SHIKIMORI_URL}/api/animes/${animeId}`);
  }
}
