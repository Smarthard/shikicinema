import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Shikivideo} from '../../types/shikivideo';
import {Observable} from 'rxjs';
import {ShikivideosUnique} from '../../types/shikivideos-unique';

@Injectable({
  providedIn: 'root'
})
export class ShikivideosService {

  private SHIKIVIDEOS_API: string = 'https://smarthard.net/api/shikivideos';

  constructor(private http: HttpClient) { }

  public findById(animeId: number, params: HttpParams): Observable<Shikivideo[]> {
    return this.http.get<Shikivideo[]>(`${this.SHIKIVIDEOS_API}/${animeId}`, { params });
  }

  public findByTitle(params: HttpParams): Observable<Shikivideo[]> {
      return this.http.get<Shikivideo[]>(`${this.SHIKIVIDEOS_API}/search`, { params })
  }

  public getAnimeMaxLoadedEp(animeId: number): Observable<{length: number}> {
    return this.http.get<{length: number}>(`${this.SHIKIVIDEOS_API}/${animeId}/length`);
  }

  public getUniqueValues(params: HttpParams): Observable<ShikivideosUnique> {
    return this.http.get<ShikivideosUnique>(`${this.SHIKIVIDEOS_API}/unique`, { params });
  }
}
