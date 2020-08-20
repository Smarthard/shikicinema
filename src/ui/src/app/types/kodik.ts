export namespace Kodik {
  export interface ISearchResponse {
    readonly time: string,
    readonly total: number,
    readonly results: Array<IVideo>
  }

  export interface IVideo {
    readonly id: string,
    readonly type: string,
    readonly link: string,
    readonly title: string,
    readonly title_orig: string,
    readonly other_title: string,
    readonly translation: ITranslation,
    readonly year: number,
    readonly last_season: number,
    readonly last_episode: number,
    readonly episodes_count: number,
    readonly kinopoisk_id: string,
    readonly imdb_id: string,
    readonly worldart_link: string,
    readonly quality: string,
    readonly camrip: boolean,
    readonly blocked_countries: Array<string>,
    readonly blocked_seasons: object,
    readonly created_at: string,
    readonly updated_at: string,
    readonly seasons: ISeasons,
  }

  export interface ITranslation {
    readonly id: number,
    readonly title: string,
    readonly type: 'voice' | 'subtitles'
  }

  export interface ISeasons {
    [season: number]: ISeason
  }

  export interface ISeason {
    readonly link: string,
    readonly episodes: IEpisodes
  }

  export interface IEpisodes {
    [episode: number]: string
  }
}
