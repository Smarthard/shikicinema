import { KodikEpisodes } from '@app/shared/types/kodik/kodik-episodes.interface';

export interface KodikSeasons {
    [season: number | string]: {
        /** season link */
        link: string;

        episodes: KodikEpisodes;
    }
}
