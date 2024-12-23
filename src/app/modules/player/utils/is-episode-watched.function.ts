import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export function isEpisodeWatched(episode: number, userRate: UserAnimeRate): boolean {
    const { status, episodes: watchedEpisode } = userRate || {};

    return status === 'completed' ||
        (status === 'watching' || status === 'rewatching') && episode <= watchedEpisode;
}
