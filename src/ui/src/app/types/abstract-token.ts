export abstract class AbstractToken {

  public constructor(
    private _token?: any
  ) {
    Object.assign(this, _token);
  }

  abstract get token(): string;

  abstract get expired(): boolean;

}
