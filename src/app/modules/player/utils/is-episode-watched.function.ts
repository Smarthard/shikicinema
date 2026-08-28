import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export function isEpisodeWatched(episode: number, userRate: UserAnimeRate | undefined): boolean {
    const { status, episodes: watchedEpisode } = userRate || {};

    return status === 'completed' ||
        (status === 'watching' || status === 'rewatching') && episode <= (watchedEpisode ?? 0);
}
