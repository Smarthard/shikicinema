import { VideoInfoInterface } from '@app/modules/player/types';

export interface PlayerStoreInterface {
    videos: {
        [animeId: string]: VideoInfoInterface[];
    }
}
