import { AsyncPipe, SlicePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { IonButton, ModalController, ToastController } from '@ionic/angular/standalone';
import { TranslocoService } from '@ngneat/transloco';

import { Comment } from '@app/shared/types/shikimori/comment';
import { CommentComponent } from '@app/modules/player/components/comment/comment.component';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

@Component({
    selector: 'app-comments',
    standalone: true,
    imports: [
        CommentComponent,
        IonButton,
        AsyncPipe,
        SlicePipe,
    ],
    providers: [ModalController],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent {
    @HostBinding('class.comments')
    private commentsClass = true;

    @ViewChildren('comment', { read: ElementRef })
    private commentElRefs: QueryList<ElementRef<HTMLElement>>;

    private _isLoading = true;
    private sliceLastCommentsSubject = new BehaviorSubject(20);

    readonly sliceLastComments$ = this.sliceLastCommentsSubject.asObservable();
    readonly skeletonComments = new Array(20).fill(0);
    readonly trackById = trackById;

    @Input() set isLoading(isLoading: boolean) {
        this._isLoading = isLoading;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    @Input() comments: Comment[];

    @Input() showMoreButton: boolean;

    @Output()
    showMoreComments = new EventEmitter<void>();

    constructor(
        private readonly _toast: ToastController,
        private readonly _renderer: Renderer2,
        private readonly _transloco: TranslocoService,
        private readonly _modalController: ModalController,
    ) {}

    private _flashComment(commentEl: HTMLElement): void {
        this._renderer.addClass(commentEl, 'comments__item--flashing');

        setTimeout(() => this._renderer.removeClass(commentEl, 'comments__item--flashing'), 1000);
    }

    private async _showReplyMissingToast(): Promise<void> {
        const toast = await this._toast.create({
            id: 'player-comment-reply-missing',
            color: 'warning',
            message: this._transloco.translate('PLAYER_MODULE.PLAYER_PAGE.COMMENT_REPLY_MISSING'),
            duration: 1000,
        });

        toast.present();
    }

    loadLastComments(): void {
        this.sliceLastCommentsSubject.next(this.comments.length);
        this.showMoreComments.emit();
    }

    onOpenReply(commentId: string, isRecursive = false): void {
        const targetElementId = `comment-${commentId}`;
        const comments = this.commentElRefs.map(({ nativeElement }) => nativeElement);
        const targetComment = comments.find((el) => el.getAttribute('id') === targetElementId);

        if (targetComment) {
            targetComment.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

            this._flashComment(targetComment);
        } else if (!isRecursive) {
            this.loadLastComments();

            setTimeout(() => this.onOpenReply(commentId, true));
        } else {
            this._showReplyMissingToast();
        }
    }

    async onOpenImage(imageSrc: string): Promise<void> {
        const cssClass = 'comments__image-viewer';
        const componentProps = { imageSrc };
        const { ImageViewerModalComponent: component } = await import('@app/shared/components/image-viewer-modal');

        const modal = await this._modalController.create({
            component,
            componentProps,
            cssClass,
        });

        modal.present();
    }
}
