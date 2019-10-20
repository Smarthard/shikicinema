export namespace Shikimori {

  export class User {

    readonly id: number;
    readonly nickname: string;
    readonly avatar: string;

    constructor(obj?: any) {
      Object.assign(this, obj);
    }
  }

}
