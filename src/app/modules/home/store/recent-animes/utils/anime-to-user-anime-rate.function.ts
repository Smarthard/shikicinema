import { ShikicinemaAnime } from '@app/shared/types/shikicinema/v1';
import {
    UserAnimeRate,
    UserRateStatusType,
    UserRateTargetEnum,
} from '@app/shared/types/shikimori';
import { getShikicinemaAnimeTitle } from '@app/shared/utils/get-shikicinema-anime-title.function';

export function animeToUserAnimeRate(
    anime: ShikicinemaAnime,
    watchedEpisode = 0,
    visited: string | null = null,
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
            image: null,
            kind: anime.kind,
            name: getShikicinemaAnimeTitle(anime.titles, 'en'),
            score: `${anime.score}`,
            status: anime.status,
            url: `https://shikimori.io/animes/${anime.id}`,
            // TODO: заменить костыли на велосипеды
            japanese: getShikicinemaAnimeTitle(anime.titles, 'jp') as never,
            english: getShikicinemaAnimeTitle(anime.titles, 'en') as never,
            russian: getShikicinemaAnimeTitle(anime.titles, 'ru') as never,
        },
        user_id: null,
    };
}
