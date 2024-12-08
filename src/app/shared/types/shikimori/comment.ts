import { CommentableEnum } from '@app/shared/types/shikimori/commentable.enum';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';

export interface Comment {
    readonly id?: ResourceIdType;
    readonly user_id?: ResourceIdType;
    readonly commentable_id?: ResourceIdType;
    readonly commentable_type?: CommentableEnum;
    readonly body?: string;
    readonly html_body?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly is_offtopic?: boolean;
    readonly is_summary?: boolean;
    readonly can_be_edited?: boolean;
    readonly user?: UserBriefInfoInterface;
}
