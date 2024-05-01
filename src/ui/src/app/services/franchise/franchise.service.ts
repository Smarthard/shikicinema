import { Injectable } from '@angular/core';
import * as yaml from 'yaml';

@Injectable({
  providedIn: 'root'
})

export class FranchiseService {

  async fetchAnimeData(domain: string, animeId: number): Promise<any> {
    const animeUrl = `${domain}/api/animes/${animeId}`;
    const animeResponse = await fetch(animeUrl);
    return animeResponse.json();
  }

  async fetchData(): Promise<any> {
    const url = 'https://corsproxy.io/?' + encodeURIComponent('https://raw.githubusercontent.com/shikimori/neko-achievements/master/priv/rules/_franchises.yml');
    const response = await fetch(url);
    const text = await response.text();
    return yaml.parse(text);
  }
}
