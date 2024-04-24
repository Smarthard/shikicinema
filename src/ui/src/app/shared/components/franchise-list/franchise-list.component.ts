import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jsyaml from 'js-yaml';

interface AnimeData {
  id: number;
  russian: string;
  kind: string;
  episodesAired: number;
  episodes: number;
  e?: number;
  episode?: number;
}

@Component({
  selector: 'app-franchise-list',
  templateUrl: './franchise-list.component.html',
  styleUrls: ['./franchise-list.component.css']
})
export class FranchiseListComponent implements OnInit {

  franchiseData: AnimeData[] = [];
  showFranchiseList = true;
  currentAnimeId: number;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.currentAnimeId = this.extractIdFromUrl(window.location.href);
    this.fetchFranchiseData();
  }

  private extractIdFromUrl(url: string): number {
    const regex = /\/(\d+)\/\d+(?:\?id=\d+)?$/;
    const match = url.match(regex);
    return match ? parseInt(match[1], 10) : 0;
  }

  private async fetchFranchiseData(): Promise<void> {
    const animeUrl = `https://shikimori.one/api/animes/${this.currentAnimeId}`;
    const animeResponse = await fetch(animeUrl);
    const animeData = await animeResponse.json();
    const franchise = animeData.franchise;

    const excludedIdsUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://raw.githubusercontent.com/shikimori/neko-achievements/master/priv/rules/_franchises.yml');
    const excludedIdsData = await this.fetchData(excludedIdsUrl);
    const excludedIds = this.parseNotAnimeIds(excludedIdsData, franchise);

    const graphqlUrl = 'https://shikimori.one/api/graphql';
    const query = `
      {
        animes(order: aired_on, franchise: "${franchise}", limit: 50, excludeIds: "${excludedIds}", status: "!anons") {
          id
          russian
          kind
          episodesAired
          episodes
          userRate { episodes status }
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

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const { data } = await response.json();
    if (data && data.animes) {
      this.franchiseData = data.animes.map((node: any) => {
        const maxEpisode = node.episodes || node.episodesAired || 1;
        const userRate = node.userRate;
        const watched = +(userRate ? userRate.episodes : 0);
        let episode = userRate && userRate.status === 'completed' ? 1 : watched + 1;
        if (episode > maxEpisode) {
          episode = maxEpisode;
        }
        return {
          id: parseInt(node.id, 10),
          russian: node.russian,
          kind: this.translateKind(node.kind),
          episodesAired: node.episodesAired,
          episodes: node.episodes,
          userRate: node.userRate.episodes,
          UserRateStatus: node.userRate.status,
          episode: episode
        };
      }).reverse();

      let e = 1;
      this.franchiseData.forEach((node: AnimeData) => {
        if (node.kind === 'ТВ') {
          node.e = e++;
        }
      });
    }
  }


  private translateKind(kind: string): string {
    switch (kind) {
      case 'tv':
        return 'ТВ';
      case 'movie':
        return 'п/ф';
      case 'ova':
        return 'OVA';
      case 'ona':
        return 'ONA';
      case 'special':
        return 'Спецвыпуск';
      case 'tv_special':
        return 'Спешл';
      default:
        return kind;
    }
  }

  private async fetchData(url: string): Promise<any> {
    const response = await this.http.get(url, { responseType: 'text' }).toPromise();
    return jsyaml.load(response);
  }


  private parseNotAnimeIds(data: any[], franchise: string): number[] {
    let excludedIdsSet: Set<number> = new Set();
    data.forEach(entry => {
      if (entry.neko_id === franchise) {
        const notAnimeIds = entry.filters?.not_anime_ids || [];
        notAnimeIds.forEach(id => excludedIdsSet.add(id));
      }
    });
    const excludedIds = Array.from(excludedIdsSet);
    return excludedIds;
  }



  toggleFranchiseList(): void {
    this.showFranchiseList = !this.showFranchiseList;
  }

  changeCurrentAnimeId(animeId: number): void {
    this.currentAnimeId = animeId;
    this.fetchFranchiseData();
  }
}
