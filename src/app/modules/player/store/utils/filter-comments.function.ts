import { Comment } from '@app/shared/types/shikimori/comment';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export function filterComments(commentId: ResourceIdType, comments: Comment[]): Comment[] {
    return comments?.filter((comment) => comment.id !== commentId);
}
