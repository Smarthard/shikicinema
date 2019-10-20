import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Shikimori} from '../../types/shikimori';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShikimoriService {

  private SHIKIMORI_URL: string = 'https://shikimori.one';

  constructor(
    private http: HttpClient
  ) {}

  public getUserRates(params: HttpParams): Observable<any> {
    return this.http.get<any>(`${this.SHIKIMORI_URL}/api/v2/user_rates`, { params });
  }

  public whoAmI(): Observable<Shikimori.User> {
    return this.http.get<Shikimori.User>(`${this.SHIKIMORI_URL}/api/users/whoami`);
  }
}
