export class Shikivideo {
  constructor(
    readonly id: number,
    readonly url: string,
    readonly animeId: string,
    readonly russian: string,
    readonly english: string,
    readonly episode: number,
    readonly kind: string,
    readonly language: string,
    readonly quality: string,
    readonly author: string,
    readonly watches: string,
    readonly uploader: string
  ) {}
}
