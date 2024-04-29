import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as yaml from 'yaml';
import { FETCH_RESOURCE_TIMEOUT, fetch } from '../../../../../../fetch-timeout';
import { Router } from '@angular/router';

interface AnimeData {
  id: number;
  name: string;
  kind: string;
  episodes: number;
  episodesAired: number;
  status: string;
  user_status: string;
  year: number;
  e?: number;
  related: { relationRu: string; anime: { id: string } | null }[];
}

@Component({
  selector: 'app-franchise-list',
  templateUrl: './franchise-list.component.html',
  styleUrls: ['./franchise-list.component.css']
})
export class FranchiseListComponent implements OnInit {

  franchiseData: AnimeData[] = [];
  showFranchiseList = false;
  isHidden = true;
  currentAnimeId: number;
  franchiseHovered: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

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
    if (franchise !== null) { 
      this.isHidden = false;
    }
    const excludedIdsUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://raw.githubusercontent.com/shikimori/neko-achievements/master/priv/rules/_franchises.yml');
    const excludedIdsData = await this.fetchData(excludedIdsUrl);
    const excludedIds = this.parseNotAnimeIds(excludedIdsData, franchise);
    const graphqlUrl = 'https://shikimori.one/api/graphql';
    const query = `
    {
      animes(order: aired_on, franchise: "${franchise}", limit: 100, excludeIds: "${excludedIds}", status: "!anons") {
        id
        russian
        kind
        episodes
        episodesAired
        status
        userRate { status }
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

    if (data && data.animes) {
      let franchiseData: AnimeData[] = data.animes.map((node: any) => ({
        id: parseInt(node.id, 10),
        name: node.russian,
        kind: this.translateKind(node.kind),
        episodes: node.episodes,
        episodesAired: node.episodesAired,
        status: node.status,
        user_status: node.userRate ? node.userRate.status : null,
        year: node.airedOn.year,
        related: node.related,
      }));
      franchiseData.reverse();
      let hasMoves = false;
      let iterations = 0;
      do {
        hasMoves = false;
        const withPrehistory = franchiseData.filter(node => node.related.some(rel => rel.relationRu === "Предыстория"));

        withPrehistory.forEach(item => {
          const index = franchiseData.findIndex(node => node.id === item.id);
          const prehistory = item.related.find(rel => rel.relationRu === "Предыстория");
          if (prehistory) {
            const prehistoryIndex = franchiseData.findIndex(node => node.id === parseInt(prehistory.anime.id, 10));
            if (prehistoryIndex > index) {
              // Remove prehistory item from its current position
              const prehistoryItem = franchiseData.splice(prehistoryIndex, 1)[0];
              // Insert prehistory item before the current item
              franchiseData.splice(index, 0, prehistoryItem);
              hasMoves = true;
            }
          }
        });

        iterations++;

        if (iterations > franchiseData.length) {
          break;
        }
      } while (hasMoves);

      this.franchiseData = franchiseData;
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
      case 'pv':
        return 'Проморолик';
      case 'cm':
        return 'Реклама';
      case 'music':
        return 'Клип';
      case 'movie':
        return 'Фильм';
      case 'ova':
        return 'OVA';
      case 'ona':
        return 'ONA';
      case 'special':
        return 'Спецвыпуск';
      case 'tv_special':
        return 'TV Спецвыпуск';
      default:
        return kind;
    }
  }

  private async fetchData(url: string): Promise<any> {
    const response = await this.http.get(url, { responseType: 'text' }).toPromise();
    return yaml.parse(response); // Parsing YAML to JSON
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

  openFranchise(animeId: number, episodes: number, episodesAired: number): void {
    this.changeCurrentAnimeId(animeId);
    this._getAnimeInfo(animeId, 800)
      .then((anime) => {
        const userRate = anime.user_rate;
        const maxEpisode = episodes || episodesAired || 1;
        const watched = +(userRate ? userRate.episodes : 0);
        let episode = userRate && userRate.status === 'completed' ? 1 : watched + 1;
        if (episode > maxEpisode) {
          episode = maxEpisode;
        }
        this.router.navigateByUrl(`/${animeId}/${episode}`);
      });
  }

  private _getAnimeInfo(animeId: number, timeout = FETCH_RESOURCE_TIMEOUT) {
    return fetch(`https://shikimori.one/api/animes/${animeId}`, {}, timeout)
      .then((res) => res.json())
      .catch(() => ({ id: animeId }));
  }

  toggleFranchiseList(): void {
    this.showFranchiseList = !this.showFranchiseList;
  }

  changeCurrentAnimeId(animeId: number): void {
    this.currentAnimeId = animeId;
  }
}
