export class Shikivideo {
  readonly id: number;
  readonly url: string;
  readonly animeId: string;
  readonly russian: string;
  readonly english: string;
  readonly episode: number;
  readonly kind: string;
  readonly language: string;
  readonly quality: string;
  readonly author: string;
  readonly watches: string;
  readonly uploader: string;

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
