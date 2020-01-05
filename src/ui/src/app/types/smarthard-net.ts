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
    public author: string;
    public kind: string;
    public language: string;
    public url: string;
    public quality: string;

    constructor(obj?: any) {
      Object.assign(this, obj);
    }

    public get player() {
      return this.url ? this.url.split('.').slice(-2)[0] : null;
    }
  }

  export class Unique {
    readonly [episode: number]: {
      anime_id?: number[],
      anime_russian?: string[],
      anime_english?: string[],
      author?: string[],
      kind?: string[],
      url?: string[]
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
}
