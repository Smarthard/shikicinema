import { CommentableEnum } from '@app/shared/types/shikimori/commentable.enum';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface CreateComment {
    comment: {
        /** bb-код или просто текст */
        body: string;
        commentable_id: ResourceIdType;
        commentable_type: CommentableEnum;
        is_offtopic: boolean;
    };

    // поля ниже практически всегда false

    /** оповещение для всех подписчиков темы (только для администраторов клуба) */
    broadcast?: boolean;

    /** технический флаг для шикимори, не использовать */
    frontend?: boolean;
}
