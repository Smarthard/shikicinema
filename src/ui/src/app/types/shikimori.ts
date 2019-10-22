export namespace Shikimori {

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

}
