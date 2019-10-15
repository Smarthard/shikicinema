export class ShikivideosUnique {
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
