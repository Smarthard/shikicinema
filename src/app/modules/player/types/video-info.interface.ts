import { UploaderIdType } from '@app/shared/types/uploader-id.type';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';
import { VideoQualityEnum } from '@app/modules/player/types/video-quality.enum';

export interface VideoInfoInterface {
    /* id of the video uploaded to shikicinema
        completely optional for other video sources
        also DO NOT confuse with animeId! */
    id?: number;
    episode: number;
    url: string;
    urlType: 'iframe' | 'video';
    uploader?: UploaderIdType;
    kind: VideoKindEnum;
    author?: string;
    quality: VideoQualityEnum;
    language: string;
}
