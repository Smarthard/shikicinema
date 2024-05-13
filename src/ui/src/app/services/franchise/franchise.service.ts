import {Injectable} from '@angular/core';
import {KodikService} from '../kodik-api/kodik.service';
import {ShikimoriService} from '../shikimori-api/shikimori.service';
import {firstValueFrom, lastValueFrom} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Shikimori} from '../../types/shikimori';

@Injectable({
  providedIn: 'root'
})

export class FranchiseService {
  franchise: Shikimori.IFranchiseResponse
  domain?: string;


  constructor(
    private kodik: KodikService,
    private shikimori: ShikimoriService,
    private http: HttpClient
  ) { }

  async fetchFranchiseData(): Promise<any> {
    this.franchise = this.kodik.exportFranchise();
    if (this.franchise.nodes.length > 0) {
      return this.franchise;
    }
  }

  async GraphQL(): Promise<any> {
    const ids = this.franchise.nodes.map((node: any) => node.id).join(',');
    this.domain = await firstValueFrom(this.shikimori.domain$);
    const graphqlUrl = `${this.domain}/api/graphql`;
    const query = `
      {
        animes(ids:"${ids}", limit: 50) {
          id
          userRate { status }
        }
      }
    `;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      })
    };

    const response = await lastValueFrom(this.http.post<any>(graphqlUrl, { query }, httpOptions));
    return response.data;
  }

  async GetEpisode(animeId: number): Promise<any> {
    const episodeUrl = `${this.domain}/api/animes/${animeId}`;
    return await lastValueFrom(this.http.get<any>(episodeUrl));
  }
}
