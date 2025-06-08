import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    input,
    output,
} from '@angular/core';
import {
    IonContent,
    IonIcon,
    IonItem,
    IonList,
    IonText,
} from '@ionic/angular/standalone';

@Component({
    selector: 'app-modify-actions-popover',
    imports: [
        IonContent,
        IonList,
        IonItem,
        IonText,
        IonIcon,
    ],
    templateUrl: './modify-actions-popover.component.html',
    styleUrl: './modify-actions-popover.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifyActionsPopoverComponent {
    editLabel = input<string>();
    deleteLabel = input<string>();

    edit = output<void>();
    delete = output<void>();
}
