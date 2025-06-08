import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Renderer2,
    ViewEncapsulation,
    inject,
    input,
    output,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { Comment } from '@app/shared/types/shikimori/comment';
import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { ProcessShikimoriHtmlPipe } from '@app/modules/player/pipes/process-shikimori-html.pipe';
import { ToCommentUrlPipe } from '@app/modules/player/pipes/to-comment-url.pipe';

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [
        DatePipe,
        ProcessShikimoriHtmlPipe,
        ToCommentUrlPipe,
        ImageCardComponent,
    ],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
    @HostBinding('class.comment')
    private commentClass = true;

    private readonly _renderer = inject(Renderer2);

    comment = input<Comment>();

    openReply = output<string>();
    toggleSpoiler = output<HTMLElement>();
    openImage = output<string>();

    private _toggleSpoiler(spoilerEl: HTMLElement): void {
        const openedClass = 'is-opened';
        const isOpened = spoilerEl.classList.contains(openedClass);

        if (isOpened) {
            this._renderer.removeClass(spoilerEl, openedClass);
        } else {
            this._renderer.addClass(spoilerEl, openedClass);
        }

        this.toggleSpoiler.emit(spoilerEl);
    }

    onClick(event: Event): void {
        const target = event.target as HTMLElement;

        switch (true) {
            case target instanceof HTMLAnchorElement:
                const isMention = target.classList.contains('b-mention');
                const isImage = target.className.includes('image');
                const href = target.getAttribute('href') ?? '';

                if (isMention) {
                    event.preventDefault();
                    const [commentId] = /([\d]+)/.exec(href);
                    this.openReply.emit(commentId);
                }

                if (isImage) {
                    event.preventDefault();
                    this.openImage.emit(href);
                }

                break;
            default:
                const isSpoiler = target.className.includes('spoiler');

                if (isSpoiler) {
                    event.preventDefault();
                    this._toggleSpoiler(target);
                }

                break;
        }
    }
}
