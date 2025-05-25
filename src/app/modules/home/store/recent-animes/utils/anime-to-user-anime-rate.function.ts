import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

export function animeToUserAnimeRate(
    anime: AnimeBriefInfoInterface,
    watchedEpisode = 0,
    visited: string = null,
): UserAnimeRate {
    return {
        id: -1,
        status: 'recent' as UserRateStatusType,
        anime: {
            ...anime,
            english: anime.english as never,
            japanese: anime.japanese as never,
        },
        episodes: watchedEpisode,
        score: 0,
        chapters: 0,
        rewatches: 0,
        volumes: 0,
        target_id: anime.id,
        target_type: 'Anime',
        text: '',
        text_html: '',
        created_at: new Date().toISOString(),
        updated_at: visited,
        user_id: null,
    };
}
