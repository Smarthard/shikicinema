import {AbstractToken} from './abstract-token';

export namespace SmarthardNet {

  export class Shikivideo {
    public id: number;
    public url: string;
    public anime_id: string;
    public anime_russian: string;
    public anime_english: string;
    public episode: number;
    public kind: string;
    public language: string;
    public quality: string;
    public author: string;
    public watches_count: string;
    public uploader: string;

    constructor(obj?: any) {
      Object.assign(this, obj);
    }

    public getUrlHostname(): string {
      return (new URL(this.url)).hostname;
    }

    public getSecondLvlDomain() {
      let domains = this.getUrlHostname().split('.');

      return domains.slice(-2).join('.');
    }

    public hasHighQuality() {
      return /(DVD|BD)/i.test(this.quality);
    }

    public hasUnknownAttribute(attr: string) {
      return !this[attr] || /unknown/i.test(this[attr]);
    }
  }

  export class VideoFilter {
    constructor(
      public author?: string,
      public kind?: string,
      public language?: string,
      public url?: string,
      public quality?: string
    ) {}

    public get player() {
      let url: URL;
      try {
        url = new URL(`${this.url}`.startsWith('http') ? this.url : `http://${this.url}`);
      } catch (e) {
        console.warn(e);
      }
      return this.url && url ? url.hostname.split('.').slice(-2).join('.') : null;
    }
  }

  export class Unique {
    [episode: number]: {
      anime_id?: number[],
      anime_russian?: string[],
      anime_english?: string[],
      author?: string[],
      kind?: string[],
      url?: string[],
      quality?: string[],
      language?: string[],
    }

    constructor(obj?: any) {
      Object.assign(this, obj);
    }
  }

  export class ServerStatus {
    readonly api: string = 'offline';
    readonly server: string = 'offline';

    constructor(obj?: any) {
      Object.assign(this, obj);
    }

    isApiOnline(): boolean {
      return this.api !== 'offline';
    }

    isServerOnline(): boolean {
      return this.server !== 'offline';
    }
  }

  export enum Kind {
    Dub = 'ОЗВУЧКА',
    Sub = 'СУБТИТРЫ',
    Raw = 'ОРИГИНАЛ',
    Unknown = 'UNKNOWN'
  }

  export interface IToken {
    readonly access_token: string,
    readonly expires: string
  }

  export class Token extends AbstractToken {
    constructor(
      private access_token?: string,
      private expires?: string
    ) {
      super();
    }

    public get token(): string {
      return this.access_token;
    }

    public get expired(): boolean {
      const expires = Date.parse(this.expires || '1970');
      return Date.now() > expires;
    }

    public get expireDate(): Date {
      return new Date(Date.parse(this.expires));
    }
  }

  export interface IRequest {
    readonly id?: number,
    readonly type?: string,
    readonly target_id?: number,
    readonly requester?: string,
    readonly comment?: string,
    readonly request?: object,
    readonly old?: object,
    readonly approved?: boolean,
    readonly reviewer_id?: number,
    readonly reviewed?: string,
    readonly feedback?: string,
    readonly createdAt?: string
  }

  export class Request {

    constructor(
      public id: number,
      public type: string,
      public targetId: number,
      public requester: string,
      public comment: string,
      public request: object,
      public old: object,
      public approved: boolean,
      public reviewerId: number,
      public reviewed: Date,
      public feedback: string,
      public created: Date
    ) {}

  }

  export function mergeUniques(uniques: Unique[]) {
    const mergedUnique = uniques[0] || new Unique();

    for (let i = 1; i < uniques.length; i++) {
      for (const episode in uniques[i]) {
        const nextValues = uniques[i][episode];

        if (mergedUnique[episode] && mergedUnique[episode]) {
          for (const key in nextValues) {
            const newUnique = new Set([ ...mergedUnique[episode][key], ...nextValues[key] ]);
            mergedUnique[episode][key] = [...newUnique];
          }
        } else {
          mergedUnique[episode] = nextValues;
        }
      }
    }

    return mergedUnique;
  }
}
