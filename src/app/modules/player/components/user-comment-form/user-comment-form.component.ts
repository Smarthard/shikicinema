import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    input,
    output,
} from '@angular/core';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { IonButton, IonIcon, IonTextarea } from '@ionic/angular/standalone';
import { NoWhitespacesValidator } from '@app/shared/validators/no-whitespaces.validator';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-user-comment-form',
    standalone: true,
    imports: [
        IonTextarea,
        IonButton,
        IonIcon,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './user-comment-form.component.html',
    styleUrl: './user-comment-form.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCommentFormComponent {
    comment = new FormControl('', [
        Validators.required,
        NoWhitespacesValidator(),
    ]);

    isAuthorized = input(false);

    send = output<string>();

    login = output<void>();

    onSend(comment: string): void {
        this.send.emit(comment);
        this.comment.reset();
    }

    onLogin(): void {
        this.login.emit();
    }
}
