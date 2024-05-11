import { Injectable } from '@angular/core';
import { KodikService } from '../kodik-api/kodik.service';
import { ShikimoriService } from '../shikimori-api/shikimori.service';
import { firstValueFrom } from 'rxjs';
import { notAnimeIds} from '../../types/franchise';

@Injectable({
  providedIn: 'root'
})

export class FranchiseService {
  franchise: any;
  domain?: string;


  constructor(private kodik: KodikService, private shikimori: ShikimoriService) { }
  async fetchFranchiseData(): Promise<any> {
    this.franchise = this.kodik.exportFranchise();
    if (this.franchise.nodes.length > 0) {
      this.franchise.nodes = this.franchise.nodes.filter((franchise: { id: number; }) => !notAnimeIds.includes(franchise.id));
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
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query })
    });

    const { data } = await response.json();
    return data
  }

  async GetEpisode(animeId: number): Promise<any> {
    const response = await fetch(`${this.domain}/api/animes/${animeId}`);
    return response.json();
  }

}
