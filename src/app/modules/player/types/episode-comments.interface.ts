import { Comment } from '@app/shared/types/shikimori/comment';
import { Topic } from '@app/shared/types/shikimori/topic';

export interface EpisodeCommentsInterface {
    [episode: string]: {
        isLoading: boolean;
        isShownAll: boolean;
        topic: Topic;
        comments: Comment[];
    }
}
