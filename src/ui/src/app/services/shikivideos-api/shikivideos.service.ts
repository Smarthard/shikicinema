import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ShikivideosFindParams} from "../../types/shikivideos-find-params";
import {Shikivideo} from "../../types/shikivideo";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShikivideosService {

  private SHIKIVIDEOS_API: string = 'https://smarthard.net/api/shikivideos';

  constructor(private http: HttpClient) { }

  public findById(animeId: number, options: ShikivideosFindParams): Observable<Shikivideo[]> {
    let query: string = `${this.SHIKIVIDEOS_API}/${animeId}${options.getSearchParams()}`;

    return this.http.get<Shikivideo[]>(query);
  }

  public findByTitle(options: ShikivideosFindParams): Observable<Shikivideo[]> {
      let query: string = `${this.SHIKIVIDEOS_API}/search${options.getSearchParams()}`;

      return this.http.get<Shikivideo[]>(query)
  }

  public getAnimeMaxLoadedEp(animeId: number): Observable<{length: number}> {
    return this.http.get<{length: number}>(`${this.SHIKIVIDEOS_API}/${animeId}/length`);
  }
}
