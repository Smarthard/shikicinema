import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'app-profile-info',
    standalone: true,
    imports: [
        NgIf,
        TranslocoPipe,
        IonIcon,
        IonButton,
    ],
    templateUrl: './profile-info.component.html',
    styleUrl: './profile-info.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoComponent {
    @HostBinding('class.profile-info')
    private settingsPageClass = true;

    @Input()
    serviceName: string;

    @Input()
    serviceIcon: string;

    @Input()
    isAuthorized: boolean;

    @Input()
    avatar: string;

    @Input()
    nickname: string;

    @Output()
    login = new EventEmitter<void>();

    @Output()
    logout = new EventEmitter<void>();
}
