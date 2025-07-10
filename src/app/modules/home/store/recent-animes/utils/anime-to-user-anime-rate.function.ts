import {
    AnimeBriefInfoInterface,
    UserBriefRateInterface,
    UserRateStatusType,
    UserRateTargetEnum,
} from '@app/shared/types/shikimori';

export function animeToUserAnimeRate(
    anime: AnimeBriefInfoInterface,
    watchedEpisode = 0,
    visited: string = null,
): UserBriefRateInterface {
    return {
        id: -1,
        status: 'recent' as UserRateStatusType,
        episodes: watchedEpisode,
        score: 0,
        chapters: 0,
        rewatches: 0,
        volumes: 0,
        target_id: anime.id,
        target_type: UserRateTargetEnum.ANIME,
        text: '',
        text_html: '',
        created_at: visited,
        updated_at: visited,
        user_id: null,
    };
}
