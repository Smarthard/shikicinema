import {Injectable} from '@angular/core';
import {StorageService} from '../chrome-storage/storage.service';
import {Observable} from 'rxjs';
import {ShikicinemaSettings} from '../../types/ShikicinemaSettings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  public get(): Observable<ShikicinemaSettings> {
    return StorageService.get('local', 'settings');
  }

  public async set(obj: any) {
    const settings = { settings: obj };
    return StorageService.set('local', settings).toPromise();
  }
}
