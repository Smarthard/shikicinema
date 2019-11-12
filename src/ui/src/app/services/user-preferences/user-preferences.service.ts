import { Injectable } from '@angular/core';
import {SmarthardNet} from '../../types/smarthard-net';
import {StorageService} from '../chrome-storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  private prefMap = new Map<number, SmarthardNet.VideoFilter>();

  constructor() {
    StorageService.get<string|any>('local', 'preferences')
      .subscribe(
        pref => {
          // keep it to be checking for typeof 'string' because of older versions compatibility
          this.prefMap = pref && typeof pref === 'string' ? new Map(JSON.parse(pref)) : this.prefMap;
        }
      )
  }

  public get(animeId: number): SmarthardNet.VideoFilter {
    return this.prefMap.get(animeId) || new SmarthardNet.VideoFilter();
  }

  public set(animeId: number, filter: SmarthardNet.VideoFilter) {
    this.prefMap.set(animeId, filter);
    StorageService.set('local', { preferences: JSON.stringify([...this.prefMap]) });
  }

}
