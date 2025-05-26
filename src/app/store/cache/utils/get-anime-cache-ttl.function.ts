import { addDays, addHours } from 'date-fns';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';

export function getAnimeCacheTtl(anime: AnimeBriefInfoInterface): string {
    const now = new Date();

    return anime?.status !== 'released'
        ? addHours(now, 12).toISOString()
        : addDays(now, 30).toISOString();
}
