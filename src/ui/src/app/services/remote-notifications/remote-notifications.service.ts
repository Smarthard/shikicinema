import {Injectable} from '@angular/core';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {SmarthardNet} from '../../types/smarthard-net';
import {StorageService} from '../chrome-storage/storage.service';
import {map} from 'rxjs/operators';
import {ShikivideosService} from '../shikivideos-api/shikivideos.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteNotificationsService {

  private readonly EXTENSION_VERSION = chrome.runtime.getManifest().version;
  private _notificationsSubject = new ReplaySubject<SmarthardNet.Notification[]>(1);
  readonly notifications$ = this._notificationsSubject.asObservable();

  constructor(
    private videosApi: ShikivideosService
  ) {
    this.videosApi.getNotifications(this.EXTENSION_VERSION)
      .pipe(
        (notifications) => combineLatest([notifications, this.getReadNotifications()]),
        map(([notifications, readNotifications]) => notifications
          .map(x => Object.assign(x, readNotifications.find(y => y.id === x.id)))
        )
      )
      .subscribe((notifications) => this._notificationsSubject.next(notifications));
  }

  public getReadNotifications(): Observable<SmarthardNet.Notification[]> {
    return StorageService.get<string>('local', 'remoteNotifications')
      .pipe(
        map((fromStorage) => fromStorage ? JSON.parse(fromStorage) : []),
        map((notifications: any) => notifications
          .map(v => new SmarthardNet.Notification(
            v.id, new Date(Date.parse(v.created)), v.info, v.viewed, v.min_version, v.max_version, new Date(v.expires)
          ))
          .filter(
            (notification: SmarthardNet.Notification) =>
              !notification.expires || (notification.expires && notification.expires > new Date())
          )
        )
      )
  }

  public setReadNotifications(notifications: SmarthardNet.Notification[]) {
    notifications.forEach((notification) => notification.viewed = true);
    StorageService.set('local', { remoteNotifications: JSON.stringify(notifications) });
  }
}
