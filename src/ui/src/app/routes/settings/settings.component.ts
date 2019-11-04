import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings/settings.service';
import {ShikicinemaSettings} from '../../types/ShikicinemaSettings';
import {Title} from '@angular/platform-browser';
import {NotificationsService} from '../../services/notifications/notifications.service';
import {Notification, NotificationType} from '../../types/notification';
import {Location} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import {SmarthardNet} from '../../types/smarthard-net';
import {Shikimori} from '../../types/shikimori';
import {AbstractToken} from '../../types/abstract-token';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public TOKEN_HELP_TEXT = '\n\nShikicinema следит за актуальностью токенов доступа самостоятельно,'
    + ' но, если Вы испытываете трудности при загрузке нового видео, можете попробовать обновить токен доступа вручную';
  public settings = new ShikicinemaSettings();
  public shikivideos: SmarthardNet.Token;
  public shikimori: Shikimori.Token;

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
    this.shikivideos = await this.auth.shikivideos;
    this.shikimori = await this.auth.shikimori;
  }

  async update() {
    await this.settingsService.set(this.settings);
    this.notify.add(new Notification(NotificationType.OK, 'Настройки сохранены'));
  }

  async reset() {
    this.settings = new ShikicinemaSettings();
    await this.update();
  }

  async drop(token: AbstractToken) {
    if (token instanceof SmarthardNet.Token) {
      this.shikivideos = new SmarthardNet.Token();
      await this.auth.shikivideosDrop();
    }

    if (token instanceof Shikimori.Token) {
      this.shikimori = new Shikimori.Token();
      await this.auth.shikimoriDrop();
    }
  }

  async sync(token: AbstractToken) {
    if (token instanceof SmarthardNet.Token) {
      this.shikivideos = await this.auth.shikivideosSync();
    }

    if (token instanceof Shikimori.Token) {
      this.shikimori = await this.auth.shikimoriSync();
    }
  }

  back() {
    this.location.back();
  }
}
