import { Pipe, PipeTransform, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { Comment } from '@app/shared/types/shikimori/comment';
import { selectShikimoriDomain } from '@app/store/shikimori/selectors';


@Pipe({
    name: 'toCommentUrl',
    standalone: true,
    pure: true,
})
export class ToCommentUrlPipe implements PipeTransform {
    readonly store = inject(Store);
    readonly SHIKIMORI_URL = this.store.selectSignal(selectShikimoriDomain);

    transform(comment: Comment): string {
        return `${this.SHIKIMORI_URL()}/comments/${comment?.id}`;
    }
}
