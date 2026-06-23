import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori';
import { ShikicinemaAnime } from '@app/shared/types/shikicinema/v1';

export function shikimoriToShikicinemaAnime(anime: AnimeBriefInfoInterface): ShikicinemaAnime {
    return {
        id: anime.id,
        tags: [],
        kind: anime.kind,
        status: anime.status,
        duration: null,
        aired_on: anime.aired_on,
        released_on: anime.released_on,
        next_episode_at: anime.next_episode_at,
        description: anime.description,
        studios: [],
        titles: [],
        genres: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        episodes: anime.episodes,
        episodes_aired: anime.episodes_aired,
        poster: {
            avif: `/static/animes/${anime.id}.avif`,
            webp: `/static/animes/${anime.id}.webp`,
            jpeg: `/static/animes/${anime.id}.jpeg`,
            placeholder: `/static/animes/${anime.id}-placeholder.jpeg`,
        },
        score: anime.score ? Number(anime.score) : null,
        rating: anime.rating,
    };
}
