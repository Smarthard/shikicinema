import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    effect,
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
import { TranslocoModule } from '@jsverse/transloco';

import { Comment } from '@app/shared/types/shikimori/comment';
import { NoWhitespacesValidator } from '@app/shared/validators/no-whitespaces.validator';

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

    editComment = input<Comment>();

    send = output<string>();

    sendEdited = output<Comment>();

    login = output<void>();

    isEditMode = computed(() => Boolean(this.editComment()?.id));

    editCommentEffect = effect(() => {
        if (this.isEditMode()) {
            const shikimoriCodeComment = this.editComment()?.body;
            this.comment.setValue(shikimoriCodeComment);
        }
    });

    onSend(comment: string): void {
        this.send.emit(comment);
        this.comment.reset();
    }

    onSendEdited(comment: string): void {
        const edittedComment = {
            ...this.editComment(),
            body: comment,
        };

        this.sendEdited.emit(edittedComment);
        this.comment.reset();
    }

    onLogin(): void {
        this.login.emit();
    }
}
