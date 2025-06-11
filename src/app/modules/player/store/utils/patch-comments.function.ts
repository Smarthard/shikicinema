import { Comment } from '@app/shared/types/shikimori/comment';

export function patchComments(comment: Comment, comments: Comment[]): Comment[] {
    const index = comments.findIndex((c) => c.id === comment.id);

    return [
        ...comments.slice(0, index - 1) || [],
        comment,
        ...comments.slice(index + 1) || [],
    ];
}
