export abstract class AbstractToken {

  abstract get token(): string;

  abstract get expired(): boolean;

  abstract get expireDate(): Date;
}
