import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { adjustEpisode } from '@app/shared/utils/adjust-episode.function';
import { getMaxEpisode } from '@app/modules/player/utils/get-max-episodes.function';

export function getLastUnwatchedEpisode(anime: AnimeBriefInfoInterface): number {
    const { user_rate: userRate = null } = anime || {};
    const { status = 'planned' } = userRate || {};
    const maxEpisode = getMaxEpisode(anime) || 1;
    const watchedEpisode = userRate?.episodes || 0;
    const episode = watchedEpisode === maxEpisode && status === 'completed'
        ? 1
        : adjustEpisode(watchedEpisode + 1, watchedEpisode || 1, maxEpisode);

    return episode;
}
