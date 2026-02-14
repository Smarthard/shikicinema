import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { adjustEpisode } from '@app/shared/utils/adjust-episode.function';
import { getMaxEpisode } from '@app/modules/player/utils/get-max-episodes.function';

export function getLastUnwatchedEpisode(anime: AnimeBriefInfoInterface, uploadedMaxEpisode = 1): number {
    const { user_rate: userRate = null, episodes } = anime || {};
    const { status = 'planned' } = userRate || {};
    const isUnknownTotalEpisodes = !episodes;
    const watchedEpisode = userRate?.episodes || 0;
    const maxEpisode = getMaxEpisode(anime, uploadedMaxEpisode) || 1;

    // аниме просмотрено - предлагаем пересмотреть и кидаем на 1 серию
    const episode = watchedEpisode === maxEpisode && status === 'completed'
        ? 1
        : isUnknownTotalEpisodes && watchedEpisode >= maxEpisode
            // если неясно сколько всего будет эпизодов, добавляем +1
            // чтобы корректно определить непросмотренную серию
            ? watchedEpisode + 1
            // в противном случае просто clamp'им серию
            : adjustEpisode(watchedEpisode + 1, watchedEpisode || 1, maxEpisode);

    return episode;
}
