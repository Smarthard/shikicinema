import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {of} from 'rxjs';
import {catchError, shareReplay, timeout} from 'rxjs/operators';
import {SmarthardNet} from '../../types/smarthard-net';
import {Shikimori} from '../../types/shikimori';
import {Kodik} from '../../types/kodik';
import {environment} from '../../../environments/environment';
import {ShikimoriService} from '../shikimori-api/shikimori.service';

@Injectable({
  providedIn: 'root'
})
export class KodikService {

  private _kodikResponseCache: Kodik.ISearchResponse;
  private _franchise: Shikimori.IFranchiseResponse;

  constructor(
    private http: HttpClient,
    private shikimori: ShikimoriService,
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

  private static _isMovie(video: Kodik.IVideo) {
    return /movie/i.test(video.id);
  }

  private static _isSubtitles(video: Kodik.IVideo) {
    return video.translation.type === 'subtitles';
  }

  private static _castToShikivideo(animeId: number, season: string, episode: number, kodikvideo: Kodik.IVideo) {
    const link = KodikService._isMovie(kodikvideo)
      ? kodikvideo.link
      : kodikvideo.seasons[season].episodes[episode];
    const url = `https:${link}`;

    return new SmarthardNet.Shikivideo({
      id: url,
      anime_id: animeId,
      url, episode,
      quality: KodikService._translateQuality(kodikvideo.quality),
      anime_russian: kodikvideo.title,
      anime_english: kodikvideo.title_orig,
      author: kodikvideo.translation.title,
      kind: KodikService._isSubtitles(kodikvideo) ? 'субтитры' : 'озвучка',
      language: 'russian',
      foreign: true
    });
  }

  private static _buildNewUnique(unique: SmarthardNet.Unique, newValues: object, episode: string): SmarthardNet.Unique {

    if (unique && unique[episode]) {
      for (const key in unique[episode]) {
        const newUnique = new Set([ ...unique[episode][key], ...newValues[key] ]);
        unique[episode][key] = [...newUnique];
      }
    } else {
      unique[episode] = newValues;
    }

    return unique[episode];
  }

  private _getCachedResponse() {
    return this._kodikResponseCache;
  }

  private _getKodikvideos(anime: Shikimori.Anime) {
    return this.http.get<Kodik.ISearchResponse>(`https://kodikapi.com/search`, { params: new HttpParams()
        .set('token', `${environment.KODIK_TOKEN}`)
        .set('shikimori_id', `${anime.id}`)
        .set('with_seasons', 'true')
        .set('with_episodes', 'true')
    })
      .pipe(
        timeout(3000),
        catchError(() => {
          console.error('Unable to retrieve data from Kodik API');
          return of({ time: null, total: 0, results: [] } as Kodik.ISearchResponse)
        }),
        shareReplay(1)
      );
  }

  private async _getSeason(anime: Shikimori.Anime) {
    if (!this._franchise || this._franchise.current_id !== anime.id) {
      this._franchise = await this.shikimori.getFranchise(anime).toPromise();
    }

    const response = await this.getVideos(anime);
    const animeLinksInFranchise = this._franchise?.links.filter((value) => value.source_id === anime.id);
    const hasSpecials = animeLinksInFranchise.some((link) => link.relation === 'other');
    const hasSpecialsInResults = response?.results?.some((result) => result?.seasons?.[0])

    /* if there are specials remove them */
    if (hasSpecials || hasSpecialsInResults) {
      for (let i = 0; i < response.results.length; i++) {
        delete this._kodikResponseCache.results[i].seasons[0];
      }
    }

    return Object.keys(response?.results?.[0]?.seasons || {})[0];
  }

  public async getVideos(anime: Shikimori.Anime) {
    let response = this._getCachedResponse();

    if (!response) {
      response = await this._getKodikvideos(anime).toPromise();
      this._kodikResponseCache = response;
    }

    return response;
  }

  public async search(anime: Shikimori.Anime, episode: number): Promise<SmarthardNet.Shikivideo[]> {
    const response = await this.getVideos(anime);
    const season = await this._getSeason(anime);

    return response.results
      .filter((video) => video?.seasons?.[season]?.episodes?.[episode] || KodikService._isMovie(video))
      .map((v) => KodikService._castToShikivideo(anime.id, season, episode, v));
  }

  public async getUnique(anime) {
    const response = await this.getVideos(anime);
    const season = await this._getSeason(anime);
    const unique = new SmarthardNet.Unique();
    const videos = response.results.filter(video => video && video.seasons && video.seasons[season] || KodikService._isMovie(video));

    for (const video of videos) {
      const newValues = {
        author: [video.translation.title],
        url: [new URL(`https://${video.link}`).hostname],
        quality: [KodikService._translateQuality(video.quality)],
        kind: [ KodikService._isSubtitles(video) ? 'субтитры' : 'озвучка'],
        language: ['russian']
      };

      if (video.seasons && video.seasons[season] && video.seasons[season].episodes) {
        for (const episode in video.seasons[season].episodes) {
          unique[episode] = KodikService._buildNewUnique(unique, newValues, episode)
        }
      } else {
        unique[1] = KodikService._buildNewUnique(unique, newValues, '1');
      }
    }

    return unique;
  }

}
