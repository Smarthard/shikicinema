import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface EpisodeNotification {
    episode_notification: {
        anime_id: ResourceIdType;
        episode: number;

        // можно ставить сегодняшнюю дату
        aired_at: string;

        // игнорировать
        is_anime365?: boolean;
        is_fandab?: boolean;
        is_raw?: boolean;
        is_subtitiles?: boolean;
    };

    // приватный токен для создания оповещения серии
    token: string;
}
