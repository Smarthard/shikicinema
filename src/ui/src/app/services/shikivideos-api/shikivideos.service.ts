import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ShikivideosFindParams } from "../../types/shikivideos-find-params";
import {Shikivideo} from "../../types/shikivideo";

@Injectable({
  providedIn: 'root'
})
export class ShikivideosService {

  private SHIKIVIDEOS_API: string = 'https://smarthard.net/api/shikivideos';

  constructor(private http: HttpClient) { }

  public findById(animeId: number, options: ShikivideosFindParams): Promise<Shikivideo[]> {
    return new Promise<Shikivideo[]>((resolve) => {
      let query: string = `${this.SHIKIVIDEOS_API}/${animeId}${options.getSearchParams()}`;

      this.http.get(query)
        .subscribe((videos: Array<Shikivideo>) => {
          resolve(videos);
        });
    });
  }
}
