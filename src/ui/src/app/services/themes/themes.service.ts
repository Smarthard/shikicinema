import { Injectable } from '@angular/core';
import {SettingsService} from '../settings/settings.service';
import {ShikicinemaSettings} from '../../types/ShikicinemaSettings';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {

  private _settings = new ShikicinemaSettings();
  private _themeSubject = new Subject<string>();
  readonly theme$ = this._themeSubject.asObservable();

  constructor(private settingsService: SettingsService) {
    this.settingsService.get()
      .subscribe(
        settings => {
          this._settings = new ShikicinemaSettings(settings);
          this._themeSubject.next(this._settings.theme);
        }
      );
  }

  change(theme: 'light' | 'dark' | 'custom') {
    this._themeSubject.next(theme);
  }

}
