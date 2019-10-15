export class ShikimoriUser {

  readonly id: number;
  readonly nickname: string;
  readonly avatar: string;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
