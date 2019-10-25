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
