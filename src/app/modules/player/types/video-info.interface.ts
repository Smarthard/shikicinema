import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';

export interface VideoInfoInterface {
    /* id of the video uploaded to shikicinema
        completely optional for other video sources
        also DO NOT confuse with animeId! */
    id?: number;
    episode: number;
    url: string;
    urlType: 'iframe' | 'video';
    uploader?: string;
    kind: VideoKindEnum;
    author?: string;
    quality: string;
    language: string;
}
