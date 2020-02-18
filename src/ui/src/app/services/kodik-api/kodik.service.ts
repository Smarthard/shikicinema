import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {SmarthardNet} from '../../types/smarthard-net';
import {Shikimori} from '../../types/shikimori';
import {Kodik} from '../../types/kodik';

@Injectable({
  providedIn: 'root'
})
export class KodikService {

  private _videosCache: Kodik.IVideo[];

  constructor(
    private http: HttpClient
  ) {}

  private static _translateQuality(quality: string) {
    const animeQualities = ['TV', 'DVD', 'BD', 'WEB', 'UNKNOWN'];

    for (const animeQ of animeQualities) {
      if (quality.toUpperCase().includes(animeQ)) {
        return animeQ;
      }
    }

    return 'unknown';
  }

  private static _castToShikivideo(animeId: number, episode: number, kodikvideo: Kodik.IVideo) {
    const link = kodikvideo.seasons[1].episodes[episode];
    const url = `https:${link}`;

    return new SmarthardNet.Shikivideo({
      id: url,
      anime_id: animeId,
      url: url,
      episode: episode,
      quality: KodikService._translateQuality(kodikvideo.quality),
      anime_russian: kodikvideo.title,
      anime_english: kodikvideo.title_orig,
      author: kodikvideo.translation.title,
      kind: 'озвучка',
      language: 'russian',
      foreign: true
    });
  }

  private _getCached() {
    return this._videosCache;
  }

  public getKodikvideos(anime: Shikimori.Anime) {
    return this.http.get<Kodik.ISearchResponse>(`https://smarthard.net/api/kodik/search`, { params: new HttpParams()
        .set('types', 'anime,anime-serial')
        .set('strict', 'true')
        .set('with_seasons', 'true')
        .set('with_episodes', 'true')
        .set('title', anime.name)
    })
      .pipe(
        map((res: Kodik.ISearchResponse) => res.results)
      );
  }

  public async search(anime: Shikimori.Anime, episode: number): Promise<SmarthardNet.Shikivideo[]> {
    let videos = this._getCached();

    if (!videos) {
      videos = await this.getKodikvideos(anime).toPromise();
      this._videosCache = videos;
    }

    return videos
      .filter(video => video && video.seasons[1] && video.seasons[1].episodes[episode])
      .map(v => KodikService._castToShikivideo(anime.id, episode, v));
  }

}
