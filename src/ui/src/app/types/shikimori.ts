import {AbstractToken} from './abstract-token';

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

  export class Token extends AbstractToken {
    private access_token: string;
    private refresh_token: string;
    private created_at: number;
    private expires_in: number;

    public get expired(): boolean {
      return new Date() > new Date((this.created_at + this.expires_in) * 1000);
    }

    public get token(): string {
      return this.access_token;
    }

    public get resfresh(): string {
      return this.refresh_token;
    }

  }
}
