import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SmarthardNet} from '../../types/smarthard-net';

@Injectable({
  providedIn: 'root'
})
export class ShikivideosService {

  private SHIKIVIDEOS_API: string = 'https://smarthard.net/api/shikivideos';

  constructor(private http: HttpClient) { }

  public uploadVideo(params: HttpParams): Observable<SmarthardNet.Shikivideo> {
    return this.http.post<SmarthardNet.Shikivideo>(`${this.SHIKIVIDEOS_API}`, {}, { params });
  }

  public findById(animeId: number, params: HttpParams): Observable<SmarthardNet.Shikivideo[]> {
    return this.http.get<SmarthardNet.Shikivideo[]>(`${this.SHIKIVIDEOS_API}/${animeId}`, { params });
  }

  public findByTitle(params: HttpParams): Observable<SmarthardNet.Shikivideo[]> {
      return this.http.get<SmarthardNet.Shikivideo[]>(`${this.SHIKIVIDEOS_API}/search`, { params })
  }

  public getAnimeMaxLoadedEp(animeId: number): Observable<{length: number}> {
    return this.http.get<{length: number}>(`${this.SHIKIVIDEOS_API}/${animeId}/length`);
  }

  public getUniqueValues(params: HttpParams): Observable<SmarthardNet.Unique> {
    return this.http.get<SmarthardNet.Unique>(`${this.SHIKIVIDEOS_API}/unique`, { params });
  }
}
