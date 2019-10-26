export class Notification {

  constructor(
    readonly type: NotificationType,
    readonly message: string,
    readonly err?: any
  ) {}

}

export enum NotificationType {
  OK,
  WARNING,
  ERROR
}
