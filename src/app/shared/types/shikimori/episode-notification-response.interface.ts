import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface EpisodeNotificationResponse {
    id: ResourceIdType;
    topic_id: ResourceIdType;
    anime_id: ResourceIdType;
    episode: number;

    is_anime365: boolean;
    is_fandab: boolean;
    is_raw: boolean;
    is_subtitiles: boolean;
}
