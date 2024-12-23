import { Pipe, PipeTransform } from '@angular/core';

import { Comment } from '@app/shared/types/shikimori/comment';
import { environment } from '@app-env/environment';


@Pipe({
    name: 'toCommentUrl',
    standalone: true,
    pure: true,
})
export class ToCommentUrlPipe implements PipeTransform {
    readonly SHIKIMORI_URL = environment.shikimori.apiURI;

    transform(comment: Comment): string {
        return `${this.SHIKIMORI_URL}/comments/${comment?.id}`;
    }
}
