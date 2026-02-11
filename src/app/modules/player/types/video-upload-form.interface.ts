import { ResourceStateEnum } from '@app/shared/types';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';
import { VideoLanguageEnum } from '@app/modules/player/types/video-language.enum';
import { VideoQualityEnum } from '@app/modules/player/types/video-quality.enum';

export interface VideoUploadFormInterface {
    url: string;
    urlState: ResourceStateEnum;
    author: string;
    episode: number;
    kind: VideoKindEnum;
    quality: VideoQualityEnum;
    language: VideoLanguageEnum;
    urlType: string;
}
