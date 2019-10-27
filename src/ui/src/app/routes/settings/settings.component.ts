import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings/settings.service';
import {ShikicinemaSettings} from '../../types/ShikicinemaSettings';
import {Title} from '@angular/platform-browser';
import {NotificationsService} from '../../services/notifications/notifications.service';
import {Notification, NotificationType} from '../../types/notification';
import {Location} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public TOKEN_HELP_TEXT = `\n\nShikicinema следит за актуальностью токенов доступа самостоятельно,
   но, если Вы испытываете трудности при загрузке нового видео, можете попробовать обновить токен доступа вручную`;
  public settings = new ShikicinemaSettings();

  constructor(
    public auth: AuthService,
    private settingsService: SettingsService,
    private notify: NotificationsService,
    private title: Title,
    private location: Location
  ) { }

  async ngOnInit() {
    this.title.setTitle('Настройки Shikicinema');
    this.settingsService.get()
      .subscribe(
        settings => {
          this.settings = new ShikicinemaSettings(settings);
        }
      );
  }

  async update() {
    await this.settingsService.set(this.settings);
    this.notify.add(new Notification(NotificationType.OK, 'Настройки сохранены'));
  }

  async reset() {
    this.settings = new ShikicinemaSettings();
    await this.update();
  }

  back() {
    this.location.back();
  }
}
