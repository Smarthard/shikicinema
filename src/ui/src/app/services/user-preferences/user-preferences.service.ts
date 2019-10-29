import { Injectable } from '@angular/core';
import {SmarthardNet} from '../../types/smarthard-net';
import {StorageService} from '../chrome-storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  private prefMap = new Map<number, SmarthardNet.VideoFilter>();

  constructor() {
    StorageService.get('local', 'preferences')
      .subscribe(
        pref => {
          Object.keys(pref).forEach((key: string) => {
            this.prefMap.set(+key, new SmarthardNet.VideoFilter(pref[key]))
          })
        }
      )
  }

  public get(animeId: number): SmarthardNet.VideoFilter {
    return this.prefMap.get(animeId) || new SmarthardNet.VideoFilter();
  }

  public set(animeId: number, filter: SmarthardNet.VideoFilter) {
    this.prefMap.set(animeId, filter);
    StorageService.set('local', { preferences: this.prefMap });
  }

}
