import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'app-profile-info',
    standalone: true,
    imports: [
        TranslocoPipe,
        IonIcon,
        IonButton,
    ],
    templateUrl: './profile-info.component.html',
    styleUrl: './profile-info.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'profile-info',
    }
})
export class ProfileInfoComponent {
    serviceName = input<string>();
    serviceIcon = input<string>();
    isAuthorized = input<boolean>();
    avatar = input<string>();
    nickname = input<string>();

    login = output<void>();
    logout = output<void>();
}
