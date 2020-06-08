import {AbstractToken} from './abstract-token';

export namespace Shikimori {

  export interface Anime {
    readonly id: number,
    readonly name: string,
    readonly russian: string,
    readonly image: {
      readonly original: string,
      readonly preview: string,
      readonly x96: string,
      readonly x48: string
    },
    readonly url: string,
    readonly kind: string,
    readonly score: string,
    readonly status: string,
    readonly episodes: number,
    readonly episodes_aired: number,
    readonly rating: string,
    readonly english: string[],
    readonly japanese: string[],
    readonly duration: number,
    readonly description: string,
    readonly franchise: string,
    readonly favoured: boolean,
    readonly anons: boolean,
    readonly ongoing: boolean,
    readonly thread_id: number,
    readonly topic_id: number,
    readonly next_episode_at: string,
    readonly user_rate: UserRate
  }

  export interface ITopic {
    id: number,
    topic_title: string,
    body: string,
    html_body: string,
    html_footer: string,
    created_at: string,
    comments_count: number,
    forum: {
      id: number,
      position: number,
      name: string,
      permalink: string,
      url: string
    },
    user: User,
    type: CommentableType,
    linked_id: number,
    linked_type: string,
    linked: {
      id: number,
      name: string,
      russian: string,
      image: {
        original: string,
        preview: string,
        x96: string,
        x48: string
      },
      url: string,
      kind: string,
      score: string,
      status: string,
      episodes: number,
      episodes_aired: number,
      aired_on: string,
      released_on: string
    },
    viewed: boolean,
    last_comment_viewed: boolean,
    event: string,
    episode: number
  }

  export interface IComment {
    readonly id?: number,
    readonly user_id?: number,
    readonly commentable_id?: number,
    readonly commentable_type?: string,
    readonly body?: string,
    readonly html_body?: string,
    readonly created_at?: string,
    readonly updated_at?: string,
    readonly is_offtopic?: boolean,
    readonly is_summary?: boolean,
    readonly can_be_edited?: boolean,
    readonly user?: User
  }

  export class Comment {
    constructor(
      public id?: number,
      public commentableId?: number,
      public commentableType?: string,
      public body?: string,
      public html?: string,
      public created?: Date,
      public updated?: Date,
      public isOfftopic?: boolean,
      public isSummary?: boolean,
      public canBeEdited?: boolean,
      public user?: User,
      public deleted?: boolean
    ) {}

    public get isEdited(): boolean {
      return this.created && this.updated && this.created.getDate() !== this.updated.getDate();
    }

    public get lastUpdated(): Date {
      return !this.isEdited ? this.created : this.updated;
    }
  }

  export type CommentableType = 'Topic' | 'User';

  export class User {

    readonly id: number;
    readonly nickname: string;
    readonly avatar: string;

    constructor(obj?: any) {
      Object.assign(this, obj);
    }
  }

  export class UserRate {
    id?: number;
    user_id?: number;
    target_id?: number;
    target_type?: string;
    score?: number;
    status?: string;
    rewatches?: string;
    episodes?: number;
    volumes?: number;
    chapters?: number;

    constructor(obj?: any) {
      Object.assign(this, obj);
    }

  }

  export interface IToken {
    readonly access_token?: string,
    readonly refresh_token?: string,
    readonly created_at?: number,
    readonly expires_in?: number
  }

  export class Token extends AbstractToken {
    constructor(
      private access_token?: string,
      private refresh_token?: string,
      private created_at?: number,
      private expires_in?: number
    ) {
      super();
    }

    public get expired(): boolean {
      return new Date() > this.expireDate;
    }

    public get token(): string {
      return this.access_token;
    }

    public get expireDate(): Date {
      const created = this.created_at || 0;
      const expires = this.expires_in || 0;
      return new Date((created + expires) * 1000);
    }

    public get resfresh(): string {
      return this.refresh_token;
    }

  }

  export interface IEpisodeNotificationResponse {
    readonly anime_id: number,
    readonly episode: number,
    readonly aired_at: string | Date,
    readonly is_fandub?: '1' | '0',
    readonly is_raw?: '1' | '0',
    readonly is_subtitles?: '1' | '0',
    readonly is_anime365?: '1' | '0',
    readonly topic_id?: number
  }

  export interface IEpisodeNotification {
    readonly episode_notification: IEpisodeNotificationResponse,
    readonly token: string
  }
}
