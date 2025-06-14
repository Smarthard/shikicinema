import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Renderer2,
    ViewEncapsulation,
    computed,
    effect,
    inject,
    input,
    output,
    viewChildren,
} from '@angular/core';
import {
    IMAGE_CONFIG,
    IMAGE_LOADER,
    NgTemplateOutlet,
} from '@angular/common';
import {
    IonButton,
    IonLabel,
    IonSpinner,
    ModalController,
    ToastController,
} from '@ionic/angular/standalone';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Comment } from '@app/shared/types/shikimori/comment';
import { CommentComponent } from '@app/modules/player/components/comment/comment.component';
import { DEFAULT_SHIKIMORI_DOMAIN_TOKEN, SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { MakeEmptyArrayPipe } from '@app/shared/pipes/make-empty-array/make-empty-array.pipe';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { SortByCreatedAtPipe } from '@app/shared/pipes/sort-by-created-at/sort-by-created-at.pipe';
import { isShowLastItemsPipe } from '@app/modules/player/pipes/is-show-last-items.pipe';
import { shikimoriImageLoader } from '@app/shared/utils/shikimori-image-loader.function';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

@Component({
    selector: 'app-comments',
    standalone: true,
    imports: [
        CommentComponent,
        SortByCreatedAtPipe,
        isShowLastItemsPipe,
        MakeEmptyArrayPipe,
        IonButton,
        IonLabel,
        IonSpinner,
        NgTemplateOutlet,
        TranslocoPipe,
    ],
    providers: [
        ModalController,
        {
            provide: IMAGE_CONFIG,
            useValue: {
                placeholderResolution: 32,
            },
        },
        {
            provide: IMAGE_LOADER,
            useFactory: shikimoriImageLoader,
            deps: [SHIKIMORI_DOMAIN_TOKEN, DEFAULT_SHIKIMORI_DOMAIN_TOKEN],
        },
    ],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent {
    @HostBinding('class.comments')
    private commentsClass = true;

    isLoading = input<boolean>(true);

    isPartialyLoading = input<boolean>(true);

    showMoreButton = input<boolean>();

    comments = input<Comment[]>();

    highlightComment = input<ResourceIdType>();

    showMoreComments = output<void>();

    editComment = output<Comment>();

    deleteComment = output<Comment>();

    private commentElRefs = viewChildren('comment', { read: ElementRef });

    private highlightCommentEffect = effect(() => {
        const commentId = this.highlightComment();

        if (commentId) {
            this.onOpenReply(commentId);
        }
    });

    private readonly _toast = inject(ToastController);
    private readonly _renderer = inject(Renderer2);
    private readonly _transloco = inject(TranslocoService);
    private readonly _modalController = inject(ModalController);

    readonly showLastCommentCount = computed<number>(() =>
        this.showMoreButton()
            ? 20
            : this.isLoading()
                ? 20
                : this.comments().length,
    );

    readonly trackById = trackById;

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
        this.showMoreComments.emit();
    }

    onOpenReply(commentId: ResourceIdType, isRecursive = false): void {
        const targetElementId = `comment-${commentId}`;
        const comments: HTMLElement[] = this.commentElRefs().map(({ nativeElement }) => nativeElement);
        const targetComment = comments.find((el) => el.getAttribute('id') === targetElementId);

        if (targetComment) {
            if (targetComment?.classList?.contains('ion-hide')) {
                this.loadLastComments();
            }

            setTimeout(() => {
                targetComment.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                this._flashComment(targetComment);
            });
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

    onCommentEdit(comment: Comment): void {
        this.editComment.emit(comment);
    }

    onCommentDelete(comment: Comment): void {
        this.deleteComment.emit(comment);
    }
}
