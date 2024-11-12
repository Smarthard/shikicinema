import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    Renderer2,
    ViewEncapsulation,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { BbToHtmlPipe } from '@app/modules/player/pipes/bb-to-html.pipe';
import { Comment } from '@app/shared/types/shikimori/comment';
import { ImageCardModule } from '@app/shared/components/image-card/image-card.module';
import { ProcessShikimoriHtmlPipe } from '@app/modules/player/pipes/process-shikimori-html.pipe';
import { ToCommentUrlPipe } from '@app/modules/player/pipes/to-comment-url.pipe';

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [
        DatePipe,
        BbToHtmlPipe,
        ProcessShikimoriHtmlPipe,
        ToCommentUrlPipe,
        ImageCardModule,
    ],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
    @HostBinding('class.comment')
    private commentClass = true;

    @Input() comment: Comment;

    @Output() openReply = new EventEmitter<string>();
    @Output() toggleSpoiler = new EventEmitter<HTMLElement>();
    @Output() openImage = new EventEmitter<string>();

    constructor(
        private readonly _renderer: Renderer2,
    ) {}

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
