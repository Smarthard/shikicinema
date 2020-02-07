import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings/settings.service';
import {ShikicinemaSettings} from '../../types/ShikicinemaSettings';
import {Title} from '@angular/platform-browser';
import {NotificationsService} from '../../services/notifications/notifications.service';
import {Notification, NotificationType} from '../../types/notification';
import {Location} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

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

  async drop(evt: CdkDragDrop<string[]>) {
    moveItemInArray(this.settings.playerFilters, evt.previousIndex, evt.currentIndex);
    await this.update();
  }

  async newShikivideos() {
    return this.auth.shikivideosSync().toPromise();
  }

  back() {
    this.location.back();
  }
}
