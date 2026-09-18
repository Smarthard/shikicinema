import {
    ChangeDetectionStrategy,
    Component,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { IonIcon } from '@ionic/angular';

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
    host: {
        class: 'settings-group',
    }
})
export class SettingsGroupComponent {
    title = input.required<string>();

    icon = input<string>();
}
