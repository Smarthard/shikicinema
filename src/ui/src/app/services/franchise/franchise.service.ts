import { Injectable } from '@angular/core';
import * as yaml from 'yaml';
import { ShikimoriService } from '../shikimori-api/shikimori.service'
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FranchiseService {

  constructor(private shikimori: ShikimoriService) {}

  async fetchAnimeData(franchise: string): Promise<any> {
    const domain = await firstValueFrom(this.shikimori.domain$);
    if (franchise !== null) {
      const excludedIdsData = await this.fetchData();
      const excludedIds = this.parseNotAnimeIds(excludedIdsData, franchise);
      const graphqlUrl = `${domain}/api/graphql`;
      const query = `
      {
        animes(order: aired_on, franchise: "${franchise}", limit: 100, excludeIds: "${excludedIds}", status: "!anons") {
          id
          russian
          kind
          episodes
          episodesAired
          status
          userRate { status episodes  }
          airedOn { year }
          related { relationRu
            anime {
              id
            }
          } 
        }
      }
    `;

      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      const { data } = await response.json();
      return data
    }

  }

  async fetchData(): Promise<any> {
    const url = 'https://corsproxy.io/?' + encodeURIComponent('https://raw.githubusercontent.com/shikimori/neko-achievements/master/priv/rules/_franchises.yml');
    const response = await fetch(url);
    const text = await response.text();
    return yaml.parse(text);
  }

  async fetchFranchise(animeId: number) {
    const franchise = await firstValueFrom(this.shikimori.getAnime(animeId))
    return franchise.franchise
   }

  private parseNotAnimeIds(data: any[], franchise): number[] {
    const excludedIdsSet: Set<number> = new Set();
    for (const entry of data) {
      if (entry.neko_id === franchise) {
        const notAnimeIds = entry.filters?.not_anime_ids || [];
        for (const id of notAnimeIds) {
          excludedIdsSet.add(id);
        }
      }
    }
    return [...excludedIdsSet];
  }
}
