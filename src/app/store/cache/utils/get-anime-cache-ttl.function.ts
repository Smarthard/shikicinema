import { addDays, addHours } from 'date-fns';

import { ShikicinemaAnime } from '@app/shared/types/shikicinema/v1';

export function getAnimeCacheTtl(anime: ShikicinemaAnime): string {
    const now = new Date();

    return anime?.status !== 'released'
        ? addHours(now, 12).toISOString()
        : addDays(now, 7).toISOString();
}
