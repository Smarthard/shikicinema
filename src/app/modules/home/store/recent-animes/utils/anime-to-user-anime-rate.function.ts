import {
    AnimeBriefInfoInterface,
    UserAnimeRate,
    UserRateStatusType,
    UserRateTargetEnum,
} from '@app/shared/types/shikimori';

export function animeToUserAnimeRate(
    anime: AnimeBriefInfoInterface,
    watchedEpisode = 0,
    visited: string = null,
): UserAnimeRate {
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
        anime: {
            id: anime.id,
            episodes: anime.episodes,
            episodes_aired: anime.episodes_aired,
            aired_on: anime.aired_on,
            released_on: anime.released_on,
            image: anime.image,
            kind: anime.kind,
            name: anime.name,
            score: anime.score,
            status: anime.status,
            url: anime.url,
            // TODO: заменить костыли на велосипеды
            japanese: anime.japanese as never,
            english: anime.english as never,
            russian: anime.russian as never,
        },
        user_id: null,
    };
}
