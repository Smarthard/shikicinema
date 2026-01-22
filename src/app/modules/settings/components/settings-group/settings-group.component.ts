import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
    selector: 'app-settings-group',
    standalone: true,
    imports: [
        IonIcon,
    ],
    templateUrl: './settings-group.component.html',
    styleUrl: './settings-group.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsGroupComponent {
    @HostBinding('class.settings-group')
    protected settingsGroupClass = true;

    @Input({ required: true })
    title: string;

    @Input({ required: false })
    icon: string;
}
