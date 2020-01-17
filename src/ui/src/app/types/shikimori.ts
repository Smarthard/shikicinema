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
    readonly topic_id: number
  }

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
}
