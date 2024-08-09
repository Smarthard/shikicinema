import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';

export function mapKodikKind(kodikKind: 'voice' | 'subtitles'): VideoKindEnum {
    switch (kodikKind) {
        case 'voice':
            return VideoKindEnum.DUBBING;
        case 'subtitles':
            return VideoKindEnum.SUBTITLES;
        default:
            return VideoKindEnum.ORIGINAL;
    }
}
