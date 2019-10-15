export class ServerStatus {
  readonly api: string = 'offline';
  readonly server: string = 'offline';

  constructor(obj?: any) {
    Object.assign(this, obj);
  }

  isApiOnline(): boolean {
    return this.api !== 'offline';
  }

  isServerOnline(): boolean {
    return this.server !== 'offline';
  }
}
