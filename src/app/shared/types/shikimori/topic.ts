import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';

export interface Topic {
    id: number,
    topic_title: string,
    body: string,
    html_body: string,
    html_footer: string,
    created_at: string,
    comments_count: number,
    forum: {
        id: number,
        position: number,
        name: string,
        permalink: string,
        url: string
    },
    user: UserBriefInfoInterface,
    type: 'Topic' | 'User',
    linked_id: number,
    linked_type: string,
    linked: {
        id: number,
        name: string,
        russian: string,
        image: {
            original: string,
            preview: string,
            x96: string,
            x48: string
        },
        url: string,
        kind: string,
        score: string,
        status: string,
        episodes: number,
        episodes_aired: number,
        aired_on: string,
        released_on: string
    },
    viewed: boolean,
    last_comment_viewed: boolean,
    event: string,
    episode: number
}
